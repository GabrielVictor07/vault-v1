"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getVideos() {
  try {
    return await prisma.video.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return [];
  }
}

export async function getTemplates() {
  try {
    return await prisma.template.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Erro ao buscar templates:", error);
    return [];
  }
}

export async function getDashboardData() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const [promptsCount, videosCount, templatesCount, recentPrompts, recentVideos] = await Promise.all([
      prisma.prompt.count(),
      prisma.video.count(),
      prisma.template.count(),
      prisma.prompt.findMany({ take: 2, orderBy: { createdAt: "desc" }, include: { category: true } }),
      prisma.video.findMany({ take: 2, orderBy: { createdAt: "desc" }, include: { category: true } }),
    ]);

    let favoritesCount = 0;
    if (user) {
      favoritesCount = await prisma.favorite.count({
        where: { userId: user.id }
      });
    }

    // Busca o último vídeo assistido ou com progresso pendente
    let lastVideoWatched = null;
    if (user) {
      const activeProgress = await prisma.progress.findFirst({
        where: { 
          userId: user.id,
          completed: false
        },
        orderBy: { updatedAt: "desc" },
        include: {
          video: { include: { category: true } }
        }
      });

      let lastProgress = activeProgress;
      if (!lastProgress) {
        lastProgress = await prisma.progress.findFirst({
          where: { userId: user.id },
          orderBy: { updatedAt: "desc" },
          include: {
            video: { include: { category: true } }
          }
        });
      }

      if (lastProgress) {
        lastVideoWatched = lastProgress.video;
      }
    }

    // Fallback se não tiver progresso registrado: vídeo mais recente cadastrado
    if (!lastVideoWatched) {
      lastVideoWatched = await prisma.video.findFirst({
        orderBy: { createdAt: "desc" },
        include: { category: true }
      });
    }

    const recentContent = [
      ...recentPrompts.map(p => ({ ...p, type: "Prompt" })),
      ...recentVideos.map(v => ({ ...v, type: "Vídeo" })),
    ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      metrics: {
        prompts: promptsCount.toLocaleString(),
        videos: videosCount.toLocaleString(),
        templates: templatesCount.toLocaleString(),
        favorites: favoritesCount.toLocaleString()
      },
      recentContent: recentContent.slice(0, 4),
      lastVideoWatched
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return null;
  }
}
