"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPrompts() {
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

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
}

export async function toggleFavoritePrompt(promptId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Não autorizado" };
    }

    const userId = user.id;

    // Verifica se já está favoritado
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_promptId: {
          userId,
          promptId,
        },
      },
    });

    if (existing) {
      // Remove dos favoritos
      await prisma.favorite.delete({
        where: {
          userId_promptId: {
            userId,
            promptId,
          },
        },
      });
      revalidatePath("/dashboard/favorites");
      revalidatePath("/dashboard/prompts");
      return { success: true, favorited: false };
    } else {
      // Adiciona aos favoritos
      await prisma.favorite.create({
        data: {
          userId,
          promptId,
        },
      });
      revalidatePath("/dashboard/favorites");
      revalidatePath("/dashboard/prompts");
      return { success: true, favorited: true };
    }
  } catch (error: any) {
    console.error("Erro ao favoritar prompt:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserFavorites() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        prompt: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return favorites.map((f: any) => f.prompt);
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return [];
  }
}

export async function getFavoriteIds() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      select: { promptId: true },
    });

    return favorites.map((f: any) => f.promptId);
  } catch (error) {
    console.error("Erro ao buscar ids de favoritos:", error);
    return [];
  }
}
