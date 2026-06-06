"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, ArrowRight, Command } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignUp = searchParams.get("signup") === "true";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        alert("Verifique seu e-mail para confirmar o cadastro!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold tracking-tighter">VAULT 1.0</span>
          </Link>
          <h1 className="text-3xl font-bold">{isSignUp ? "Criar conta" : "Bem-vindo de volta"}</h1>
          <p className="text-zinc-400 mt-2">
            {isSignUp ? "Comece sua jornada no Vault hoje." : "Acesse seus conteúdos premium."}
          </p>
        </div>

        <div className="glass p-8 rounded-3xl space-y-6">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-secondary border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-secondary border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? "Carregando..." : isSignUp ? "CRIAR CONTA" : "ENTRAR AGORA"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-2 text-zinc-500">Ou continue com</span>
            </div>
          </div>

          <button
            onClick={handleGithubLogin}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98]"
          >
            <Command className="w-5 h-5" />
            GitHub
          </button>

          <div className="flex flex-col gap-2 pt-4 border-t border-border/30 text-center text-xs">
            <Link href="/login/recovery" className="text-zinc-400 hover:text-primary transition-colors font-bold">
              Esqueci minha senha
            </Link>
            <div className="flex justify-center gap-3 text-zinc-600">
              <Link href="/login/resend" className="text-zinc-400 hover:text-primary transition-colors font-bold">
                Não recebi meu acesso
              </Link>
              <span>•</span>
              <Link href="/login/correct-email" className="text-zinc-400 hover:text-primary transition-colors font-bold">
                Comprei com e-mail errado
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500 pt-2">
            {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
            <Link
              href={isSignUp ? "/login" : "/login?signup=true"}
              className="text-primary font-bold hover:underline"
            >
              {isSignUp ? "Faça login" : "Cadastre-se"}
            </Link>
          </p>

          <p className="text-center text-xs text-zinc-600 mt-4 leading-relaxed">
            Ao continuar, você concorda com os nossos{" "}
            <Link href="/terms" className="text-zinc-400 hover:text-white underline">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link href="/terms" className="text-zinc-400 hover:text-white underline">
              Políticas de Privacidade
            </Link>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center text-zinc-500 font-bold">
        Carregando...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
