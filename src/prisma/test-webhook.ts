import "dotenv/config";
import prisma from "../lib/prisma";

async function test() {
  const email = "bielmottagit@gmail.com";
  console.log(`🤖 Iniciando simulação de webhook da Cakto para: ${email}`);

  // 1. Limpar registros anteriores de teste
  try {
    await prisma.caktoSale.deleteMany({ where: { email } }).catch(() => {});
    await prisma.user.deleteMany({ where: { email } }).catch(() => {});
    console.log("🧹 Registros de teste anteriores limpos com sucesso.");
  } catch (e) {}

  // 2. Criar um usuário de teste inicial com plano "free"
  const testUser = await prisma.user.create({
    data: {
      id: "test-user-id-12345",
      email,
      name: "Gabriel Motta",
      plan: "free",
      status: "ACTIVE"
    }
  });
  console.log(`👤 Usuário de teste criado. Plano atual: [${testUser.plan}]`);

  // 3. Simular payload recebido da Cakto
  const payload = {
    status: "approved",
    customer: {
      email: email,
      name: "Gabriel Motta"
    }
  };

  console.log("🔔 Executando lógica do Webhook da Cakto...");

  const { status, customer } = payload;
  const customerEmail = customer.email.toLowerCase();

  const successStatuses = ["paid", "approved", "completed", "active"];

  if (successStatuses.includes(status)) {
    // Upsert na tabela CaktoSale
    const sale = await prisma.caktoSale.upsert({
      where: { email: customerEmail },
      update: { status: "APPROVED", plan: "FULL" },
      create: { email: customerEmail, status: "APPROVED", plan: "FULL" }
    });
    console.log(`💾 Registro da venda CaktoSale criado/atualizado como: [${sale.status}]`);

    // Sincronizar com o usuário cadastrado
    const user = await prisma.user.findUnique({
      where: { email: customerEmail }
    });

    if (user) {
      const updatedUser = await prisma.user.update({
        where: { email: customerEmail },
        data: { plan: "FULL" },
      });
      console.log(`🎉 SUCESSO! Usuário com e-mail [${customerEmail}] foi promovido para o plano: [${updatedUser.plan}]`);
    } else {
      console.log("⚠️ Usuário não encontrado no banco no momento do webhook (fluxo de primeiro acesso necessário).");
    }
  }

  await prisma.$disconnect();
}

test().catch(console.error);
