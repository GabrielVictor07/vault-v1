import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Endpoint para receber webhooks do Cakto
 * Fluxo: Pagamento aprovado -> Registrar venda no banco -> Identificar usuário por e-mail -> Atualizar plano para 'FULL'
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Log para depuração
    console.log("🔔 Webhook Cakto Recebido:", JSON.stringify(body, null, 2));

    const { status, customer, secret } = body;

    // Validação de segurança do Webhook da Cakto
    const expectedSecret = process.env.CAKTO_WEBHOOK_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      console.warn("⚠️ Chamada de webhook Cakto com secret inválido bloqueada.");
      return NextResponse.json({ error: "Assinatura/Secret inválido" }, { status: 401 });
    }

    const customerEmail = customer?.email?.toLowerCase();

    if (!customerEmail) {
      return NextResponse.json({ error: "E-mail do cliente não encontrado" }, { status: 400 });
    }

    // Lista de status que consideramos como pagamento bem-sucedido
    const successStatuses = ["paid", "approved", "completed", "active"];

    if (successStatuses.includes(status)) {
      // 1. Salvar ou atualizar na tabela CaktoSale
      await prisma.caktoSale.upsert({
        where: { email: customerEmail },
        update: { status: "APPROVED", plan: "FULL" },
        create: { email: customerEmail, status: "APPROVED", plan: "FULL" }
      });

      // 2. Verificar se o usuário já existe no sistema
      const user = await prisma.user.findUnique({
        where: { email: customerEmail }
      });

      if (user) {
        // Atualiza o plano do usuário existente
        await prisma.user.update({
          where: { email: customerEmail },
          data: { plan: "FULL" },
        });
        console.log(`✅ Usuário ${customerEmail} atualizado para FULL via Webhook.`);
      } else {
        console.log(`⚠️ Pagamento recebido para ${customerEmail}, mas usuário não cadastrado. Gravado na CaktoSale.`);
      }
      
      return NextResponse.json({ 
        success: true,
        message: user ? "Plano atualizado" : "Venda registrada, aguardando cadastro" 
      });
    }

    return NextResponse.json({ message: `Evento ignorado (status: ${status})` });
  } catch (error) {
    console.error("❌ Erro no Webhook Cakto:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
