import "dotenv/config";
import prisma from "../lib/prisma";

async function main() {
  console.log("🚀 Iniciando atualização da URL do Checkout do Cakto no Banco de Dados...");

  try {
    const config = await prisma.systemSettings.upsert({
      where: { id: "global" },
      update: {
        checkoutUrl: "https://pay.cakto.com.br/33o2epf_888432"
      },
      create: {
        id: "global",
        allowSignups: true,
        maintenanceMode: false,
        checkoutUrl: "https://pay.cakto.com.br/33o2epf_888432"
      }
    });

    console.log("✅ Configurações salvas no banco de dados com sucesso!");
    console.log("Configuração Atual:", JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("❌ Erro ao atualizar o banco de dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
