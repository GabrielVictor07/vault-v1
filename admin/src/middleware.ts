import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL || "bielmottagit@gmail.com";

  const isAccessingDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // Se não estiver logado ou não for o e-mail de admin autorizado, e tentar acessar o dashboard, bloqueia e redireciona
  if (isAccessingDashboard) {
    if (!user || user.email !== adminEmail) {
      return NextResponse.redirect(new URL("/vault-master-auth", request.url));
    }
  }

  // Se já for o admin logado e tentar acessar o login secreto, redireciona para o dashboard
  if (user && user.email === adminEmail && request.nextUrl.pathname === "/vault-master-auth") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/vault-master-auth"],
};
