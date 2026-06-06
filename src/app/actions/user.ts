"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { sendEmailChangeNotification } from "@/services/email";

export async function getUserProfile() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Busca o usuário correspondente no banco do Prisma
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    // Se o usuário não existir no Prisma por algum motivo (erro no webhook), cria agora
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split("@")[0] || "Usuário",
          nickname: user.user_metadata?.nickname || "",
          phone: user.phone || "",
          plan: "free",
          status: "ACTIVE",
          lastSignIn: user.last_sign_in_at ? new Date(user.last_sign_in_at) : new Date(),
        },
      });
    } else {
      // Atualiza o último acesso se for diferente ou nulo
      const lastAccess = user.last_sign_in_at ? new Date(user.last_sign_in_at) : new Date();
      if (!dbUser.lastSignIn || dbUser.lastSignIn.getTime() !== lastAccess.getTime()) {
        dbUser = await prisma.user.update({
          where: { id: user.id },
          data: { lastSignIn: lastAccess },
        });
      }
    }

    // Sincronização automática de plano (CaktoSale -> User Plan)
    if (dbUser.plan !== "FULL") {
      const sale = await prisma.caktoSale.findUnique({
        where: { email: dbUser.email.toLowerCase().trim() }
      });

      if (sale && sale.status === "APPROVED") {
        dbUser = await prisma.user.update({
          where: { id: user.id },
          data: { plan: "FULL" }
        });
      }
    }

    return dbUser;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    return null;
  }
}

export async function updateUserProfile(data: { name: string; nickname: string; phone: string }) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Não autorizado");
    }

    // Atualiza no Supabase Auth metadata
    await supabase.auth.updateUser({
      data: { 
        name: data.name,
        nickname: data.nickname,
        phone: data.phone
      }
    });

    // Atualiza no banco do Prisma
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        name: data.name,
        nickname: data.nickname,
        phone: data.phone
      },
    });

    revalidatePath("/dashboard/profile");
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("Erro ao atualizar perfil:", error);
    return { success: false, error: error.message };
  }
}

export async function syncCaktoPurchase(caktoEmail: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Não autorizado");
    }

    const emailToSearch = caktoEmail.trim().toLowerCase();
    if (!emailToSearch) {
      throw new Error("E-mail inválido");
    }

    const currentEmail = user.email!.toLowerCase().trim();

    // 1. Procurar venda aprovada na CaktoSale
    const sale = await prisma.caktoSale.findUnique({
      where: { email: emailToSearch }
    });

    if (!sale || sale.status !== "APPROVED") {
      // Se não houver venda, mas o usuário está testando e usou o próprio e-mail cadastrado, 
      // ou se o plano dele já for FULL, avisa.
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id }
      });
      
      if (currentUser?.plan === "FULL" && currentUser.email.toLowerCase() === emailToSearch) {
        return { success: true, message: "Seu acesso já está totalmente liberado como FULL!" };
      }

      return { 
        success: false, 
        error: "Nenhum pagamento aprovado foi localizado para este e-mail nos registros da Cakto. Verifique se o e-mail digitado está correto ou se o pagamento já foi compensado." 
      };
    }

    // 2. Se o e-mail da compra for DIFERENTE do e-mail de login atual, exige confirmação
    if (emailToSearch !== currentEmail) {
      // Rate limiting: máximo 3 solicitações de alteração/sincronização por e-mail a cada 15 minutos
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const recentSyncRequests = await prisma.accessToken.count({
        where: {
          userId: user.id,
          createdAt: { gte: fifteenMinutesAgo },
          type: "email_change"
        }
      });

      if (recentSyncRequests >= 3) {
        return { 
          success: false, 
          error: "Você já solicitou a sincronização de e-mails várias vezes recentemente. Aguarde 15 minutos para tentar de novo." 
        };
      }

      // Verifica se o novo e-mail já está sendo utilizado por outro cadastro
      const existingUser = await prisma.user.findUnique({
        where: { email: emailToSearch }
      });

      if (existingUser) {
        return { 
          success: false, 
          error: "O e-mail de compra informado já está cadastrado em outra conta de usuário." 
        };
      }

      // Gera o token de confirmação seguro que carrega o novo e-mail
      const rawToken = crypto.randomBytes(32).toString("hex");
      const fullToken = `${rawToken}_change_${emailToSearch}`;
      const tokenHash = crypto.createHash("sha256").update(fullToken).digest("hex");
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

      // Grava o token na tabela AccessToken
      await prisma.accessToken.create({
        data: {
          userId: user.id,
          tokenHash,
          type: "email_change",
          expiresAt
        }
      });

      // Envia notificação por e-mail para o e-mail de compra
      await sendEmailChangeNotification(emailToSearch, currentEmail, fullToken);

      return {
        success: true,
        pendingEmailChange: true,
        message: `Identificamos a compra! Por segurança, enviamos um link de confirmação para o seu e-mail de compra: ${emailToSearch}. Ao clicar no link, seu e-mail de login antigo (${currentEmail}) será substituído pelo novo e seu acesso vitalício será liberado!`
      };
    }

    // 3. E-mail de compra é IGUAL ao e-mail de login atual: ativa o plano na hora!
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { plan: "FULL" }
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/profile");

    return { 
      success: true, 
      message: "Sucesso! Sua compra na Cakto foi localizada e seu plano foi atualizado para FULL vitalício!" 
    };
  } catch (error: any) {
    console.error("Erro ao sincronizar compra Cakto:", error);
    return { success: false, error: error.message };
  }
}
