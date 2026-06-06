import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Valida se a sessão atual pertence ao e-mail configurado em ADMIN_EMAIL.
 * Deve ser chamada no topo de qualquer Server Action no admin para prevenir bypass de segurança.
 */
export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL || "bielmottagit@gmail.com";

  if (!user || user.email !== adminEmail) {
    throw new Error("Não autorizado. Apenas o administrador autorizado tem acesso a este recurso.");
  }
}
