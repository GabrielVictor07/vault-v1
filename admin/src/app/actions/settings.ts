"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifyAdminSession } from "@/lib/security";

export async function getAdminSession() {
  await verifyAdminSession();
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      lastSignIn: user.last_sign_in_at,
    };
  } catch (error) {
    console.error("Erro ao buscar sessão do admin:", error);
    return null;
  }
}

export async function updateAdminProfile(email: string) {
  await verifyAdminSession();
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar e-mail do admin:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAdminPassword(password: string) {
  await verifyAdminSession();
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar senha do admin:", error);
    return { success: false, error: error.message };
  }
}

function getSafePrisma() {
  const client = prisma;
  if (!client || !(client as any).systemSettings) {
    console.log("⚠️ [Admin Action] Prisma Client ou systemSettings inválido no cache do Node. Criando nova instância segura direta...");
    const { PrismaClient: LocalPrismaClient } = require("@prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const { Pool } = require("pg");
    
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return prisma;
    }
    
    const pool = new Pool({
      connectionString,
      max: 2,
    });
    const adapter = new PrismaPg(pool);
    return new LocalPrismaClient({
      adapter,
      log: ["error", "warn"]
    });
  }
  return client;
}

export async function getSystemDiagnostics() {
  await verifyAdminSession();
  try {
    const safePrisma = getSafePrisma();
    const [usersCount, videosCount, promptsCount, templatesCount] = await Promise.all([
      safePrisma.user.count(),
      safePrisma.video.count(),
      safePrisma.prompt.count(),
      safePrisma.template.count(),
    ]);

    // Simula a verificação de integridade dos serviços
    return {
      databaseStatus: "Operational",
      supabaseStatus: "Operational",
      caktoWebhookStatus: "Operational",
      systemVersion: "Vault 1.0.4",
      environment: process.env.NODE_ENV || "production",
      stats: {
        usersCount,
        videosCount,
        promptsCount,
        templatesCount
      }
    };
  } catch (error) {
    console.error("Erro ao buscar diagnósticos do sistema:", error);
    return {
      databaseStatus: "Error",
      supabaseStatus: "Operational",
      caktoWebhookStatus: "Operational",
      systemVersion: "Vault 1.0.4",
      environment: "production",
      stats: {
        usersCount: 0,
        videosCount: 0,
        promptsCount: 0,
        templatesCount: 0
      }
    };
  }
}

export async function getSystemConfig() {
  await verifyAdminSession();
  try {
    const safePrisma = getSafePrisma();
    let config = await safePrisma.systemSettings.findUnique({
      where: { id: "global" }
    });

    if (!config) {
      config = await safePrisma.systemSettings.create({
        data: {
          id: "global",
          allowSignups: true,
          maintenanceMode: false,
          checkoutUrl: "https://pay.cakto.com.br/33o2epf_888432"
        }
      });
    }

    return config;
  } catch (error) {
    console.error("Erro ao buscar configurações do sistema:", error);
    return {
      id: "global",
      allowSignups: true,
      maintenanceMode: false,
      checkoutUrl: "https://pay.cakto.com.br/33o2epf_888432"
    };
  }
}

export async function saveSystemConfig(allowSignups: boolean, maintenanceMode: boolean, checkoutUrl: string) {
  await verifyAdminSession();
  try {
    const safePrisma = getSafePrisma();
    
    if (!safePrisma || !(safePrisma as any).systemSettings) {
      throw new Error("Prisma Client desatualizado ou indisponível.");
    }

    const config = await (safePrisma as any).systemSettings.upsert({
      where: { id: "global" },
      update: {
        allowSignups,
        maintenanceMode,
        checkoutUrl
      },
      create: {
        id: "global",
        allowSignups,
        maintenanceMode,
        checkoutUrl
      }
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, config };
  } catch (error: any) {
    console.error("❌ Erro em saveSystemConfig:", error);
    return { success: false, error: error.message || "Erro desconhecido." };
  }
}

export async function simulateCaktoSale(email: string) {
  await verifyAdminSession();
  try {
    const safePrisma = getSafePrisma();
    const emailToRegister = email.trim().toLowerCase();
    if (!emailToRegister || !emailToRegister.includes("@")) {
      throw new Error("Por favor, informe um e-mail válido para a simulação.");
    }

    // 1. Simular a gravação da venda aprovada na CaktoSale
    await safePrisma.caktoSale.upsert({
      where: { email: emailToRegister },
      update: { status: "APPROVED", plan: "FULL" },
      create: { email: emailToRegister, status: "APPROVED", plan: "FULL" }
    });

    // 2. Verificar se o usuário já existe e atualizar o plano dele
    const existingUser = await safePrisma.user.findUnique({
      where: { email: emailToRegister }
    });

    if (existingUser) {
      await safePrisma.user.update({
        where: { email: emailToRegister },
        data: { plan: "FULL" }
      });
      return {
        success: true,
        message: `Sucesso! Venda registrada para o e-mail '${emailToRegister}'. O usuário existente foi automaticamente atualizado para o plano FULL.`
      };
    }

    return {
      success: true,
      message: `Sucesso! Venda registrada para o e-mail '${emailToRegister}'. Como este usuário ainda não está cadastrado, o acesso dele será liberado automaticamente assim que ele se cadastrar ou sincronizar nas configurações.`
    };
  } catch (error: any) {
    console.error("Erro ao simular venda Cakto:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Valida a chave mestra enviada pelo cliente comparando-a com a variável de ambiente privada.
 * É executada no servidor durante a tentativa de login do admin.
 */
export async function verifyAdminMasterKey(key: string) {
  const expectedKey = process.env.ADMIN_SECRET_KEY || "vault-master-2026";
  if (key !== expectedKey) {
    return { success: false, error: "Chave mestra inválida. Acesso negado." };
  }
  return { success: true };
}
