import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

// Tipo para os dados de envio de e-mail
interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Envia um e-mail utilizando as credenciais SMTP se estiverem configuradas no .env.
 * Caso contrário, grava o e-mail em um arquivo de log local e no console para fins de desenvolvimento/teste.
 */
export async function sendMail({ to, subject, html, text }: SendMailOptions) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || "Vault 1.0 <suporte@vaultia.site>";

  console.log(`[Email Service] Preparando e-mail para ${to} - Assunto: ${subject}`);

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: fromEmail,
        to,
        subject,
        text,
        html,
      });

      console.log(`[Email Service] E-mail enviado com sucesso via SMTP Hostinger para ${to} - MsgId: ${info.messageId}`);
      return { success: true, method: "SMTP", id: info.messageId };
    } catch (error) {
      console.error("[Email Service] Erro ao enviar e-mail via SMTP Hostinger:", error);
    }
  }

  // Fallback: Gravar localmente
  const logDir = process.cwd();
  const logFile = path.join(logDir, "temp-emails.log");

  const emailLogEntry = `
=========================================
DATA: ${new Date().toISOString()}
PARA: ${to}
ASSUNTO: ${subject}
MÉTODO: LOG LOCAL (Resend Não Configurado)
-----------------------------------------
TEXTO:
${text}

HTML:
${html}
=========================================
`;

  try {
    fs.appendFileSync(logFile, emailLogEntry, "utf8");
    console.log(`\n📧 [EMAIL SIMULADO] E-mail gravado em temp-emails.log:\n- Para: ${to}\n- Assunto: ${subject}\n- Verifique o link no arquivo temp-emails.log na raiz do seu projeto!\n`);
  } catch (err) {
    console.error("[Email Service] Falha ao escrever log de e-mail:", err);
  }

  return { success: true, method: "LOG_FILE" };
}

/**
 * Envia o e-mail de recuperação de senha
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/login/reset?token=${token}`;

  const subject = "Recuperação de Senha - Vault 1.0";
  
  const text = `Você solicitou a redefinição de senha para sua conta no Vault 1.0.
Acesse o link a seguir para criar uma nova senha:
${resetLink}

Este link é temporário e expirará em 30 minutos. Se você não solicitou isso, ignore este e-mail.`;

  const html = `
    <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; text-align: center; border-radius: 20px;">
      <h1 style="color: #ff2d8d; font-size: 28px; margin-bottom: 20px; font-weight: 900;">VAULT 1.0</h1>
      <p style="color: #ccc; font-size: 16px; margin-bottom: 30px;">Você solicitou a recuperação de senha para o seu acesso premium.</p>
      <a href="${resetLink}" style="background-color: #ff2d8d; color: #fff; text-decoration: none; padding: 15px 30px; font-weight: bold; border-radius: 12px; display: inline-block; margin-bottom: 30px; letter-spacing: 1px;">REDEFINIR MINHA SENHA</a>
      <p style="color: #666; font-size: 12px;">Ou copie e cole o link no navegador:<br><a href="${resetLink}" style="color: #ff2d8d;">${resetLink}</a></p>
      <p style="color: #444; font-size: 11px; margin-top: 40px;">Este link é temporário e expira em 30 minutos. Se você não solicitou, apenas ignore.</p>
    </div>
  `;

  return sendMail({ to: email, subject, html, text });
}

/**
 * Envia o e-mail de primeiro acesso
 */
export async function sendFirstAccessEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const setupLink = `${baseUrl}/login/reset?token=${token}&first=true`;

  const subject = "Seu Acesso ao Vault 1.0 está Liberado!";
  
  const text = `Parabéns! Seu pagamento foi aprovado e seu acesso vitalício ao Vault 1.0 foi liberado!
Acesse o link abaixo para criar sua senha de acesso e começar a usar a plataforma agora mesmo:
${setupLink}

Seja muito bem-vindo!`;

  const html = `
    <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; text-align: center; border-radius: 20px;">
      <span style="background-color: rgba(255, 45, 141, 0.1); border: 1px solid rgba(255, 45, 141, 0.2); color: #ff2d8d; padding: 6px 12px; border-radius: 20px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">PAGAMENTO APROVADO</span>
      <h1 style="color: #fff; font-size: 32px; margin-top: 15px; margin-bottom: 20px; font-weight: 900;">Bem-vindo ao <span style="color: #ff2d8d;">Vault 1.0</span></h1>
      <p style="color: #ccc; font-size: 16px; margin-bottom: 30px;">Seu acesso premium foi liberado. Crie sua senha de acesso agora para liberar os prompts, aulas e templates.</p>
      <a href="${setupLink}" style="background-color: #ff2d8d; color: #fff; text-decoration: none; padding: 15px 30px; font-weight: bold; border-radius: 12px; display: inline-block; margin-bottom: 30px; letter-spacing: 1px;">CRIAR MINHA SENHA DE ACESSO</a>
      <p style="color: #666; font-size: 12px;">Ou acesse o link:<br><a href="${setupLink}" style="color: #ff2d8d;">${setupLink}</a></p>
    </div>
  `;

  return sendMail({ to: email, subject, html, text });
}

/**
 * Envia o e-mail de reenvio de acesso
 */
export async function sendResendAccessEmail(email: string, hasPassword: boolean, token?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  if (!hasPassword && token) {
    // Se o usuário não tem senha, envia link de primeiro acesso
    return sendFirstAccessEmail(email, token);
  }

  // Se já tem senha, envia link para login ou reset
  const loginLink = `${baseUrl}/login`;
  const recoveryLink = `${baseUrl}/login/recovery`;
  const subject = "Dados de Acesso - Vault 1.0";
  
  const text = `Você solicitou o reenvio de acesso ao Vault 1.0.
Identificamos que você já possui uma conta ativa cadastrada com uma senha definida.

Para acessar a plataforma, faça login usando o link:
${loginLink}

Caso tenha esquecido sua senha, você pode redefini-la a qualquer momento em:
${recoveryLink}`;

  const html = `
    <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; text-align: center; border-radius: 20px;">
      <h1 style="color: #ff2d8d; font-size: 28px; margin-bottom: 20px; font-weight: 900;">VAULT 1.0</h1>
      <p style="color: #ccc; font-size: 16px; margin-bottom: 20px;">Identificamos que você já possui uma senha criada em nosso sistema.</p>
      <p style="color: #aaa; font-size: 14px; margin-bottom: 30px;">Clique no botão abaixo para fazer login diretamente:</p>
      <a href="${loginLink}" style="background-color: #fff; color: #000; text-decoration: none; padding: 15px 30px; font-weight: bold; border-radius: 12px; display: inline-block; margin-bottom: 20px; letter-spacing: 1px;">ENTRAR NA PLATAFORMA</a>
      <p style="color: #888; font-size: 12px;">Se esqueceu sua senha, recupere-a aqui:<br><a href="${recoveryLink}" style="color: #ff2d8d;">${recoveryLink}</a></p>
    </div>
  `;

  return sendMail({ to: email, subject, html, text });
}

/**
 * Envia notificação de alteração de e-mail com link de acesso
 */
export async function sendEmailChangeNotification(newEmail: string, oldEmail: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const setupLink = `${baseUrl}/login/reset?token=${token}&first=true`;
  const subject = "E-mail de Cadastro Atualizado - Vault 1.0";

  const text = `Olá! Seu e-mail de cadastro no Vault 1.0 foi atualizado de ${oldEmail} para este e-mail (${newEmail}) com sucesso!
Para acessar sua conta e configurar sua nova senha de acesso, clique no link abaixo:
${setupLink}

Aproveite seus conteúdos!`;

  const html = `
    <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; text-align: center; border-radius: 20px;">
      <h1 style="color: #ff2d8d; font-size: 28px; margin-bottom: 20px; font-weight: 900;">VAULT 1.0</h1>
      <p style="color: #ccc; font-size: 16px; margin-bottom: 20px;">O seu e-mail de cadastro foi atualizado com sucesso!</p>
      <p style="color: #aaa; font-size: 14px; margin-bottom: 30px;">E-mail anterior: <strong>${oldEmail}</strong><br>Novo e-mail: <strong>${newEmail}</strong></p>
      <p style="color: #ccc; font-size: 14px; margin-bottom: 35px;">Clique abaixo para configurar sua senha para o novo login:</p>
      <a href="${setupLink}" style="background-color: #ff2d8d; color: #fff; text-decoration: none; padding: 15px 30px; font-weight: bold; border-radius: 12px; display: inline-block; margin-bottom: 30px; letter-spacing: 1px;">CONFIGURAR NOVA SENHA</a>
      <p style="color: #666; font-size: 12px;">Link de acesso direto:<br><a href="${setupLink}" style="color: #ff2d8d;">${setupLink}</a></p>
    </div>
  `;

  return sendMail({ to: newEmail, subject, html, text });
}
