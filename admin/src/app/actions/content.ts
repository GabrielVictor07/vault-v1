"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifyAdminSession } from "@/lib/security";

// --- VIDEOS ---

export async function createVideo(formData: FormData) {
  await verifyAdminSession();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const url = formData.get("url") as string;
  const module = formData.get("module") as string;
  const categoryId = formData.get("categoryId") as string;
  const duration = parseInt(formData.get("duration") as string) || 0;

  try {
    await prisma.video.create({
      data: {
        title,
        description,
        url,
        module,
        categoryId,
        duration,
      },
    });

    revalidatePath("/dashboard/videos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar vídeo:", error);
    return { success: false, error: "Falha ao salvar o vídeo." };
  }
}

export async function updateVideo(id: string, formData: FormData) {
  await verifyAdminSession();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const url = formData.get("url") as string;
  const module = formData.get("module") as string;
  const categoryId = formData.get("categoryId") as string;
  const duration = parseInt(formData.get("duration") as string) || 0;

  try {
    await prisma.video.update({
      where: { id },
      data: {
        title,
        description,
        url,
        module,
        categoryId,
        duration,
      },
    });

    revalidatePath("/dashboard/videos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar vídeo:", error);
    return { success: false, error: "Falha ao atualizar o vídeo." };
  }
}

export async function deleteVideo(id: string) {
  await verifyAdminSession();
  try {
    await prisma.video.delete({
      where: { id },
    });

    revalidatePath("/dashboard/videos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar vídeo:", error);
    return { success: false, error: "Falha ao remover o vídeo." };
  }
}

export async function getVideos() {
  await verifyAdminSession();
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

export async function getVideoById(id: string) {
  await verifyAdminSession();
  try {
    return await prisma.video.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar vídeo:", error);
    return null;
  }
}

// --- TEMPLATES ---

export async function createTemplate(formData: FormData) {
  await verifyAdminSession();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const downloadUrl = formData.get("downloadUrl") as string;
  const previewUrl = formData.get("previewUrl") as string;
  const categoryId = formData.get("categoryId") as string;
  const tagsString = formData.get("tags") as string;
  const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];

  try {
    await prisma.template.create({
      data: {
        title,
        description,
        downloadUrl,
        previewUrl,
        categoryId,
        tags,
      },
    });

    revalidatePath("/dashboard/templates");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar template:", error);
    return { success: false, error: "Falha ao salvar o template." };
  }
}

export async function updateTemplate(id: string, formData: FormData) {
  await verifyAdminSession();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const downloadUrl = formData.get("downloadUrl") as string;
  const previewUrl = formData.get("previewUrl") as string;
  const categoryId = formData.get("categoryId") as string;
  const tagsString = formData.get("tags") as string;
  const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];

  try {
    await prisma.template.update({
      where: { id },
      data: {
        title,
        description,
        downloadUrl,
        previewUrl,
        categoryId,
        tags,
      },
    });

    revalidatePath("/dashboard/templates");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar template:", error);
    return { success: false, error: "Falha ao atualizar o template." };
  }
}

export async function deleteTemplate(id: string) {
  await verifyAdminSession();
  try {
    await prisma.template.delete({
      where: { id },
    });

    revalidatePath("/dashboard/templates");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar template:", error);
    return { success: false, error: "Falha ao remover o template." };
  }
}

export async function getTemplates() {
  await verifyAdminSession();
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

export async function getTemplateById(id: string) {
  await verifyAdminSession();
  try {
    return await prisma.template.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar template:", error);
    return null;
  }
}

export async function getDashboardMetrics() {
  await verifyAdminSession();
  try {
    const [userCount, promptCount, videoCount, templateCount] = await Promise.all([
      prisma.user.count(),
      prisma.prompt.count(),
      prisma.video.count(),
      prisma.template.count(),
    ]);

    return {
      userCount,
      promptCount,
      videoCount,
      templateCount,
    };
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return {
      userCount: 0,
      promptCount: 0,
      videoCount: 0,
      templateCount: 0,
    };
  }
}

export async function getRecentActivity() {
  await verifyAdminSession();
  try {
    const [users, prompts, videos, templates] = await Promise.all([
      prisma.user.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
      prisma.prompt.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
      prisma.video.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
      prisma.template.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    ]);

    const activities = [
      ...users.map(u => ({
        id: u.id,
        user: u.email,
        action: "Novo usuário registrado",
        date: u.createdAt,
        status: "completed" as const
      })),
      ...prompts.map(p => ({
        id: p.id,
        user: "Sistema",
        action: `Novo Prompt: ${p.title}`,
        date: p.createdAt,
        status: "completed" as const
      })),
      ...videos.map(v => ({
        id: v.id,
        user: "Sistema",
        action: `Novo Vídeo: ${v.title}`,
        date: v.createdAt,
        status: "completed" as const
      })),
      ...templates.map(t => ({
        id: t.id,
        user: "Sistema",
        action: `Novo Template: ${t.title}`,
        date: t.createdAt,
        status: "completed" as const
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);

    return activities;
  } catch (error) {
    console.error("Erro ao buscar atividade recente:", error);
    return [];
  }
}
