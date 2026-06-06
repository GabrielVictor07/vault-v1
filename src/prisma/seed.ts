import prisma from "../lib/prisma";
import "dotenv/config";

async function main() {
  console.log("🌱 Iniciando o seed do banco de dados...");

  // Categorias base do Vault 1.0
  const categories = [
    { name: "Landing Pages", slug: "landing-pages" },
    { name: "SaaS", slug: "saas" },
    { name: "UI Design", slug: "ui-design" },
    { name: "Dashboards", slug: "dashboards" },
    { name: "Automação", slug: "automacao" },
    { name: "Branding", slug: "branding" },
    { name: "Copywriting", slug: "copywriting" },
    { name: "Como usar IA", slug: "como-usar-ia" },
    { name: "Engenharia de Prompt", slug: "engenharia-de-prompt" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log(`✅ ${categories.length} categorias criadas/atualizadas.`);
  console.log("🌱 Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
