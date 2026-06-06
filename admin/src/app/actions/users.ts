"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifyAdminSession } from "@/lib/security";

export async function getUsers() {
  await verifyAdminSession();
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return users;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}

export async function updateUserPlan(userId: string, plan: string) {
  await verifyAdminSession();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { plan },
    });
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar plano:", error);
    return { success: false, error: "Falha ao atualizar o plano do usuário." };
  }
}
export async function updateUserStatus(userId: string, status: string) {
  await verifyAdminSession();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status },
    });
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return { success: false, error: "Falha ao atualizar o status do usuário." };
  }
}
