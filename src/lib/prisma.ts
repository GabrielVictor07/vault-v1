import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ Erro: DATABASE_URL não está definida no ambiente.");
    // No ambiente local com Next.js, às vezes o .env não carrega a tempo em scripts de servidor
    // Retornamos um PrismaClient padrão que falhará com erro descritivo
    return new PrismaClient();
  }

  try {
    const pool = new Pool({
      connectionString,
      // Configurações recomendadas para Supabase/Neon
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ 
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (error) {
    console.error("❌ Erro ao inicializar Pool do Postgres:", error);
    return new PrismaClient();
  }
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

let prismaInstance = globalThis.prisma ?? prismaClientSingleton();

// Evita cache desatualizado durante desenvolvimento se o schema mudou recentemente
if (process.env.NODE_ENV !== "production" && prismaInstance && !(prismaInstance as any).systemSettings) {
  console.log("🔄 [Client] Detectado Prisma Client desatualizado em memória. Recriando instância...");
  prismaInstance = prismaClientSingleton();
  globalThis.prisma = prismaInstance;
}

const prisma = prismaInstance;

export default prisma;
export { prisma };

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
