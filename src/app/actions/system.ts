"use server";

import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export async function getSystemConfig() {
  noStore();
  try {
    let config = await prisma.systemSettings.findUnique({
      where: { id: "global" }
    });

    if (!config) {
      config = await prisma.systemSettings.create({
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
