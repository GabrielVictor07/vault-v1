"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getVideoProgress(videoId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return await prisma.progress.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar progresso do vídeo:", error);
    return null;
  }
}

export async function toggleVideoCompleted(videoId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Não autorizado" };

    const userId = user.id;

    const existing = await prisma.progress.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
    });

    if (existing) {
      const updated = await prisma.progress.update({
        where: {
          userId_videoId: {
            userId,
            videoId,
          },
        },
        data: {
          completed: !existing.completed,
          progress: !existing.completed ? 100 : 0,
        },
      });
      revalidatePath("/dashboard/videos");
      return { success: true, completed: updated.completed };
    } else {
      const created = await prisma.progress.create({
        data: {
          userId,
          videoId,
          completed: true,
          progress: 100,
        },
      });
      revalidatePath("/dashboard/videos");
      return { success: true, completed: created.completed };
    }
  } catch (error: any) {
    console.error("Erro ao alternar status do vídeo:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserProgress() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    return await prisma.progress.findMany({
      where: { userId: user.id },
    });
  } catch (error) {
    console.error("Erro ao buscar progressos do usuário:", error);
    return [];
  }
}

export async function getModuleProgresses() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};

    const [videos, userProgress] = await Promise.all([
      prisma.video.findMany(),
      prisma.progress.findMany({ where: { userId: user.id } }),
    ]);

    const progressMap = new Map(userProgress.map((p: any) => [p.videoId, p.completed]));

    const moduleStats: Record<string, { total: number; completed: number }> = {};

    videos.forEach((video: any) => {
      const mod = video.module || "Geral";
      if (!moduleStats[mod]) {
        moduleStats[mod] = { total: 0, completed: 0 };
      }
      moduleStats[mod].total++;
      if (progressMap.get(video.id)) {
        moduleStats[mod].completed++;
      }
    });

    const modulePercentages: Record<string, number> = {};
    Object.entries(moduleStats).forEach(([mod, stats]) => {
      modulePercentages[mod] = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    });

    return modulePercentages;
  } catch (error) {
    console.error("Erro ao calcular progresso de módulos:", error);
    return {};
  }
}

export async function getLastActiveProgress() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const progress = await prisma.progress.findFirst({
      where: { 
        userId: user.id,
        completed: false // Procura uma aula que o usuário começou mas não terminou
      },
      orderBy: { updatedAt: "desc" },
      include: {
        video: true
      }
    });

    if (!progress) {
      // Se não houver aula incompleta iniciada, retorna o último vídeo assistido de qualquer forma
      return await prisma.progress.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        include: {
          video: true
        }
      });
    }

    return progress;
  } catch (error) {
    console.error("Erro ao buscar último progresso ativo:", error);
    return null;
  }
}

export async function getVideoPlayerDetails(videoId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: { category: true }
    });

    if (!video) return null;

    // Busca outros vídeos no mesmo módulo
    const playlist = await prisma.video.findMany({
      where: { module: video.module },
      orderBy: { createdAt: "asc" }
    });

    // Busca os progressos do usuário nestes vídeos
    const progresses = await prisma.progress.findMany({
      where: {
        userId: user.id,
        videoId: { in: playlist.map((v: any) => v.id) }
      }
    });

    const progressMap = new Map(progresses.map((p: any) => [p.videoId, p]));

    return {
      video,
      playlist: playlist.map((v: any) => ({
        ...v,
        completed: progressMap.get(v.id)?.completed || false,
        progress: progressMap.get(v.id)?.progress || 0,
        active: v.id === videoId
      })),
      userProgress: progressMap.get(videoId) || null
    };
  } catch (error) {
    console.error("Erro ao buscar detalhes do player de vídeo:", error);
    return null;
  }
}
