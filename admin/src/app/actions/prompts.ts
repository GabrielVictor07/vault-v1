"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifyAdminSession } from "@/lib/security";

export async function createPrompt(formData: FormData) {
  await verifyAdminSession();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  const level = formData.get("level") as string;

  try {
    await prisma.prompt.create({
      data: {
        title,
        description,
        content,
        categoryId,
        level,
      },
    });

    revalidatePath("/dashboard/prompts");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar prompt:", error);
    return { success: false, error: "Falha ao salvar o prompt." };
  }
}

export async function updatePrompt(id: string, formData: FormData) {
  await verifyAdminSession();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  const level = formData.get("level") as string;

  try {
    await prisma.prompt.update({
      where: { id },
      data: {
        title,
        description,
        content,
        categoryId,
        level,
      },
    });

    revalidatePath("/dashboard/prompts");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar prompt:", error);
    return { success: false, error: "Falha ao atualizar o prompt." };
  }
}

export async function deletePrompt(id: string) {
  await verifyAdminSession();
  try {
    await prisma.prompt.delete({
      where: { id },
    });

    revalidatePath("/dashboard/prompts");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar prompt:", error);
    return { success: false, error: "Falha ao remover o prompt." };
  }
}

export async function getCategories() {
  await verifyAdminSession();
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createCategory(name: string) {
  await verifyAdminSession();
  const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
  
  try {
    const category = await prisma.category.create({
      data: {
        name,
        slug
      }
    });
    return { success: true, category };
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return { success: false, error: "Esta categoria já existe ou ocorreu um erro." };
  }
}

export async function getPrompts() {
  await verifyAdminSession();
  try {
    return await prisma.prompt.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Erro ao buscar prompts:", error);
    return [];
  }
}

export async function getPromptById(id: string) {
  await verifyAdminSession();
  try {
    return await prisma.prompt.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar prompt:", error);
    return null;
  }
}
