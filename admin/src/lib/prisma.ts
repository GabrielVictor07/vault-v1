import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ [Admin] Erro: DATABASE_URL não está definida.");
    return new PrismaClient();
  }

  try {
    const pool = new Pool({
      connectionString,
      max: 5, // Admin usa menos conexões
    });

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ 
      adapter,
      log: ["error", "warn"],
    });
  } catch (error) {
    console.error("❌ [Admin] Erro ao inicializar Prisma:", error);
    return new PrismaClient();
  }
};

const globalForPrisma = global as unknown as { prisma: ReturnType<typeof createPrismaClient> };

let prismaInstance = globalForPrisma.prisma || createPrismaClient();

// Evita cache desatualizado durante desenvolvimento se o schema mudou recentemente
if (process.env.NODE_ENV !== "production" && prismaInstance && !(prismaInstance as any).systemSettings) {
  console.log("🔄 [Admin] Detectado Prisma Client desatualizado em memória. Recriando instância...");
  prismaInstance = createPrismaClient();
  globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
