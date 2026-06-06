"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { 
  sendPasswordResetEmail, 
  sendFirstAccessEmail, 
  sendResendAccessEmail, 
  sendEmailChangeNotification 
} from "@/services/email";

// Tempo de expiração do token em minutos (30 minutos)
const TOKEN_EXPIRATION_MINUTES = 30;

/**
 * Função utilitária para gerar o hash SHA256 de um token
 */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * 1. Esqueci minha senha
 * Gera um token temporário seguro e envia o link de redefinição de senha por e-mail.
 * A resposta é genérica por motivos de segurança.
 */
export async function requestPasswordReset(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, error: "E-mail inválido." };
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // Busca o usuário correspondente no Prisma
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    // Se o usuário existir, gera o token e envia o e-mail
    if (user) {
      // Rate limiting: máximo 3 solicitações de recuperação a cada 15 minutos
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const recentRequests = await prisma.accessToken.count({
        where: {
          userId: user.id,
          createdAt: { gte: fifteenMinutesAgo },
          type: "password_reset"
        }
      });

      if (recentRequests >= 3) {
        return { 
          success: true, 
          message: "Se este e-mail estiver cadastrado, enviaremos um link de recuperação." 
        };
      }
      // 1. Gerar token seguro
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MINUTES * 60 * 1000);

      // 2. Salvar o hash do token no banco de dados
      await prisma.accessToken.create({
        data: {
          userId: user.id,
          tokenHash,
          type: "password_reset",
          expiresAt
        }
      });

      // 3. Enviar e-mail de redefinição
      await sendPasswordResetEmail(cleanEmail, rawToken);
    } else {
      // Se não existir, simula um delay para evitar ataques de temporização
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }

    // Retorna resposta idêntica em ambos os casos para segurança ("Não revelar se um e-mail existe...")
    return { 
      success: true, 
      message: "Se este e-mail estiver cadastrado, enviaremos um link de recuperação." 
    };
  } catch (error) {
    console.error("Erro ao solicitar recuperação de senha:", error);
    return { success: false, error: "Ocorreu um erro interno. Tente novamente." };
  }
}

/**
 * 2. Redefinir senha
 * Valida o token e atualiza a senha do usuário tanto no Supabase Auth quanto no Prisma.
 */
export async function resetPasswordWithToken(token: string, password: string) {
  if (!token) {
    return { success: false, error: "Token não fornecido." };
  }

  if (!password || password.length < 6) {
    return { success: false, error: "A senha deve conter no mínimo 6 caracteres." };
  }

  try {
    const tokenHash = hashToken(token);

    // Busca o token no banco
    const dbToken = await prisma.accessToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    // Valida o token
    if (!dbToken) {
      return { success: false, error: "Link inválido ou expirado." };
    }

    if (dbToken.usedAt) {
      return { success: false, error: "Este link já foi utilizado anteriormente." };
    }

    if (dbToken.expiresAt < new Date()) {
      return { success: false, error: "Este link de redefinição expirou." };
    }

    const userId = dbToken.userId;
    const isEmailChange = token.includes("_change_");

    // 1. Se for alteração de e-mail por sincronização de compra
    if (isEmailChange || dbToken.type === "email_change") {
      const newEmail = token.split("_change_")[1]?.toLowerCase().trim();
      
      if (!newEmail || !newEmail.includes("@")) {
        return { success: false, error: "Token de alteração de e-mail corrompido." };
      }

      const oldEmail = dbToken.user.email;

      // Atualiza o e-mail e promove o plano para FULL no Prisma
      await prisma.user.update({
        where: { id: userId },
        data: { 
          email: newEmail,
          plan: "FULL"
        }
      });

      // Atualiza o e-mail no Supabase Auth de forma nativa e direta via SQL
      await prisma.$executeRawUnsafe(
        `UPDATE auth.users SET email = $1, email_change_confirm_status = 0, updated_at = NOW() WHERE id = $2`,
        newEmail,
        userId
      );

      // Sincroniza e limpa quaisquer registros antigos na CaktoSale
      await prisma.caktoSale.updateMany({
        where: { email: oldEmail.toLowerCase().trim() },
        data: { email: newEmail }
      });
      
      console.log(`[Auth Support] E-mail de login atualizado de ${oldEmail} para ${newEmail} (Acesso FULL liberado)`);
    }

    // 2. Criptografa a nova senha com bcryptjs
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // 3. Atualiza a senha diretamente no banco do Supabase Auth (auth.users)
    await prisma.$executeRawUnsafe(
      `UPDATE auth.users SET encrypted_password = $1, updated_at = NOW() WHERE id = $2`,
      hashedPassword,
      userId
    );

    // 4. Marca o token como utilizado
    await prisma.accessToken.update({
      where: { id: dbToken.id },
      data: { usedAt: new Date() }
    });

    console.log(`[Auth Support] Senha configurada com sucesso para o usuário ${userId}`);
    return { 
      success: true, 
      message: isEmailChange 
        ? "E-mail confirmado e senha cadastrada com sucesso! Faça login com seu novo e-mail." 
        : "Sua senha foi redefinida com sucesso! Você já pode fazer login." 
    };
  } catch (error) {
    console.error("Erro ao redefinir senha com token:", error);
    return { success: false, error: "Erro ao redefinir a senha. Tente novamente mais tarde." };
  }
}

/**
 * 3. Não recebi meu acesso
 * Verifica se há compra aprovada ou usuário cadastrado e reenvia as instruções ou primeiro acesso.
 */
export async function resendAccessLink(purchaseEmail: string) {
  if (!purchaseEmail || !purchaseEmail.includes("@")) {
    return { success: false, error: "E-mail inválido." };
  }

  const cleanEmail = purchaseEmail.trim().toLowerCase();

  try {
    // 1. Verificar se existe usuário já criado com esse e-mail
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (user) {
      // Rate limiting: máximo 3 solicitações de reenvio de acesso a cada 15 minutos
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const recentResends = await prisma.accessToken.count({
        where: {
          userId: user.id,
          createdAt: { gte: fifteenMinutesAgo },
          type: { in: ["first_access", "resend_access"] }
        }
      });

      if (recentResends >= 3) {
        return { 
          success: false, 
          error: "Você já solicitou o reenvio de acesso várias vezes recentemente. Aguarde 15 minutos ou verifique seu e-mail." 
        };
      }
    }

    // 2. Verificar se existe compra aprovada vinculada a esse e-mail no CaktoSale
    const sale = await prisma.caktoSale.findUnique({
      where: { email: cleanEmail }
    });

    const isApprovedSale = sale && sale.status === "APPROVED";

    if (!user && !isApprovedSale) {
      return { 
        success: false, 
        error: "Nenhum cadastro ou compra aprovada com este e-mail foi localizada em nosso sistema." 
      };
    }

    // Se a compra está aprovada, mas o usuário ainda não foi criado no banco (ou foi criado mas não tem senha configurada)
    if (!user) {
      // Cria o usuário temporário com o plano FULL (pois a compra está aprovada)
      // O ID do usuário será gerado aleatoriamente e depois atualizado no Supabase se ele criar a conta,
      // ou criamos um registro na tabela auth.users do Supabase diretamente para ele conseguir criar a conta com a senha.
      // O melhor fluxo é gerar um token e quando ele acessar o link do primeiro acesso, criamos ele no auth.users
      // Para simplificar e manter a segurança e integridade com o Supabase:
      // Vamos criar um usuário no Supabase Auth primeiro com um ID aleatório gerado!
      const userUuid = crypto.randomUUID();
      
      // Cria na tabela do Prisma
      const newUser = await prisma.user.create({
        data: {
          id: userUuid,
          email: cleanEmail,
          name: cleanEmail.split("@")[0],
          plan: "FULL",
          status: "ACTIVE"
        }
      });

      // Cria na tabela auth.users do Supabase de forma nativa e silenciosa, sem senha por enquanto
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MINUTES * 60 * 1000);

      await prisma.$executeRawUnsafe(
        `INSERT INTO auth.users (id, instance_id, email, aud, role, email_confirmed_at, created_at, updated_at) 
         VALUES ($1, '00000000-0000-0000-0000-000000000000', $2, 'authenticated', 'authenticated', NOW(), NOW(), NOW())`,
        userUuid,
        cleanEmail
      );

      // Registra o token de primeiro acesso
      await prisma.accessToken.create({
        data: {
          userId: userUuid,
          tokenHash,
          type: "first_access",
          expiresAt
        }
      });

      await sendFirstAccessEmail(cleanEmail, rawToken);
      return { success: true, message: "Enviamos o link de primeiro acesso para o seu e-mail cadastrado!" };
    }

    // Caso o usuário exista no Prisma, vamos checar se ele tem senha criada no Supabase
    const supabaseUserList = await prisma.$queryRawUnsafe<any[]>(
      `SELECT encrypted_password FROM auth.users WHERE id = $1`,
      user.id
    );

    const hasPassword = supabaseUserList.length > 0 && !!supabaseUserList[0].encrypted_password;

    if (!hasPassword) {
      // Se não tem senha (primeiro acesso pendente), gera token de primeiro acesso
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MINUTES * 60 * 1000);

      await prisma.accessToken.create({
        data: {
          userId: user.id,
          tokenHash,
          type: "first_access",
          expiresAt
        }
      });

      await sendFirstAccessEmail(cleanEmail, rawToken);
      return { success: true, message: "Enviamos as instruções e o link de primeiro acesso para o seu e-mail!" };
    }

    // Se já tem senha definida, envia e-mail com instruções padrão e links
    await sendResendAccessEmail(cleanEmail, true);
    return { success: true, message: "Como sua conta já está configurada com uma senha, enviamos os dados de acesso e login no seu e-mail!" };

  } catch (error) {
    console.error("Erro ao reenviar acesso:", error);
    return { success: false, error: "Ocorreu um erro interno. Tente novamente." };
  }
}

/**
 * 4. Comprei com e-mail errado
 * Valida a compra com o ID, altera o e-mail do usuário e da compra, e envia as instruções ao novo e-mail.
 */
export async function correctPurchaseEmail(oldEmail: string, newEmail: string, purchaseId: string) {
  if (!oldEmail || !newEmail || !purchaseId) {
    return { success: false, error: "Preencha todos os campos obrigatórios." };
  }

  const cleanOld = oldEmail.trim().toLowerCase();
  const cleanNew = newEmail.trim().toLowerCase();
  const cleanId = purchaseId.trim();

  if (cleanOld === cleanNew) {
    return { success: false, error: "O novo e-mail não pode ser idêntico ao antigo." };
  }

  try {
    // 1. Verifica se o novo e-mail já está em uso em algum cadastro
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanNew }
    });

    if (existingUser) {
      return { success: false, error: "O novo e-mail já está cadastrado em nossa plataforma." };
    }

    // 2. Valida se a compra com o e-mail antigo e o ID informado existe no CaktoSale
    // O ID da compra pode bater com o ID da CaktoSale.
    const sale = await prisma.caktoSale.findFirst({
      where: {
        id: cleanId,
        email: cleanOld,
        status: "APPROVED"
      }
    });

    if (!sale) {
      return { 
        success: false, 
        error: "Não foi possível validar os dados. Verifique se o e-mail antigo e o ID da compra estão corretos." 
      };
    }

    // 3. Verifica se o usuário com o e-mail antigo existe no Prisma
    let user = await prisma.user.findUnique({
      where: { email: cleanOld }
    });

    if (user) {
      // Rate limiting: máximo 3 tentativas de alteração de e-mail por hora
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentChanges = await prisma.accessToken.count({
        where: {
          userId: user.id,
          createdAt: { gte: oneHourAgo },
          type: "email_change"
        }
      });

      if (recentChanges >= 3) {
        return {
          success: false,
          error: "Muitas tentativas de alteração de e-mail recentes para esta conta. Tente novamente mais tarde."
        };
      }
    }

    if (!user) {
      // Se a venda está aprovada, mas o usuário não foi criado ainda no Prisma, criamos o usuário diretamente com o novo e-mail
      const userUuid = crypto.randomUUID();
      user = await prisma.user.create({
        data: {
          id: userUuid,
          email: cleanNew,
          name: cleanNew.split("@")[0],
          plan: "FULL",
          status: "ACTIVE"
        }
      });

      // Cria também no Supabase Auth
      await prisma.$executeRawUnsafe(
        `INSERT INTO auth.users (id, instance_id, email, aud, role, email_confirmed_at, created_at, updated_at) 
         VALUES ($1, '00000000-0000-0000-0000-000000000000', $2, 'authenticated', 'authenticated', NOW(), NOW(), NOW())`,
        userUuid,
        cleanNew
      );
    } else {
      // Se o usuário existe, atualiza o e-mail dele no Prisma
      await prisma.user.update({
        where: { id: user.id },
        data: { email: cleanNew }
      });

      // E atualiza diretamente no Supabase Auth (auth.users)
      await prisma.$executeRawUnsafe(
        `UPDATE auth.users SET email = $1, email_change_confirm_status = 0, updated_at = NOW() WHERE id = $2`,
        cleanNew,
        user.id
      );

      // Invalida todos os tokens antigos do usuário
      await prisma.accessToken.updateMany({
        where: { userId: user.id },
        data: { usedAt: new Date() }
      });
    }

    // 4. Atualiza o e-mail na tabela da venda CaktoSale
    await prisma.caktoSale.update({
      where: { id: sale.id },
      data: { email: cleanNew }
    });

    // 5. Gera um novo token para configurar a senha no novo e-mail
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MINUTES * 60 * 1000);

    await prisma.accessToken.create({
      data: {
        userId: user.id,
        tokenHash,
        type: "first_access",
        expiresAt
      }
    });

    // 6. Envia a notificação para o novo e-mail
    await sendEmailChangeNotification(cleanNew, cleanOld, rawToken);

    console.log(`[Auth Support] E-mail corrigido com sucesso para a venda ${sale.id} (${cleanOld} -> ${cleanNew})`);
    return { 
      success: true, 
      message: "Sucesso! O e-mail da sua compra foi atualizado e as instruções de acesso foram enviadas ao seu novo e-mail!" 
    };

  } catch (error) {
    console.error("Erro ao corrigir e-mail de compra:", error);
    return { 
      success: false, 
      error: "Ocorreu um erro interno. Verifique as informações e tente novamente." 
    };
  }
}
