"use client";

import { Suspense, useState } from "react";
import { resetPasswordWithToken } from "@/app/actions/authSupport";
import { motion } from "framer-motion";
import { Shield, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const isFirstAccess = searchParams.get("first") === "true";
  const isEmailChange = token.includes("_change_");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas digitadas não coincidem.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const res = await resetPasswordWithToken(token, password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(res.error || "Erro ao redefinir senha.");
      }
    } catch (err: any) {
      setError("Ocorreu um erro técnico. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="glass p-8 rounded-[2.5rem] max-w-sm space-y-4">
          <Shield className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-xl font-black text-white">Link Inválido</h2>
          <p className="text-zinc-400 text-sm">
            Este link de redefinição está incompleto ou inválido. Solicite uma nova recuperação.
          </p>
          <Link
            href="/login/recovery"
            className="block w-full bg-primary hover:bg-accent text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider"
          >
            SOLICITAR NOVO LINK
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-black tracking-tighter text-white">VAULT 1.0</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            {isEmailChange ? "Confirmar Novo E-mail" : isFirstAccess ? "Configurar Acesso" : "Nova Senha"}
          </h1>
          <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
            {isEmailChange 
              ? `Você está confirmando a troca para o e-mail: ${token.split("_change_")[1]?.toLowerCase().trim()}. Crie sua senha de acesso para concluir.`
              : isFirstAccess 
                ? "Crie sua senha de acesso para liberar a sua cripta de IA."
                : "Defina sua nova credencial de acesso seguro."}
          </p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-white">
                {isEmailChange ? "Acesso Configurado!" : "Senha Definida!"}
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-xs mx-auto">
                {isEmailChange 
                  ? "Seu e-mail foi atualizado com sucesso e a compra foi sincronizada! Redirecionando para a tela de login..."
                  : "Senha configurada com sucesso. Redirecionando você para a tela de login em alguns segundos..."}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider">Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="No mínimo 6 caracteres"
                    className="w-full bg-secondary border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all text-sm"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider">Confirmar Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha digitada"
                    className="w-full bg-secondary border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all text-sm"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs bg-red-500/10 p-4 rounded-2xl border border-red-500/20 font-semibold"
                >
                  {error}
                </motion.p>
              )}

              <button
                disabled={loading}
                className="w-full bg-primary hover:bg-accent text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98] mt-2"
              >
                {loading ? "Gravando..." : isEmailChange ? "CONFIRMAR E-MAIL E SENHA" : isFirstAccess ? "ATIVAR MEU ACESSO" : "REDEFINIR SENHA"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center text-zinc-500 font-bold">
        Carregando...
      </div>
    }>
      <ResetContent />
    </Suspense>
  );
}
