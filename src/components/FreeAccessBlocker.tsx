"use client";

import { useState } from "react";
import { syncCaktoPurchase } from "@/app/actions/user";
import { motion } from "framer-motion";
import { Shield, DollarSign, RefreshCw, LogOut, Check, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface FreeAccessBlockerProps {
  email: string;
  checkoutUrl: string;
}

export function FreeAccessBlocker({ email, checkoutUrl }: FreeAccessBlockerProps) {
  const router = useRouter();
  const [caktoEmail, setCaktoEmail] = useState(email);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await syncCaktoPurchase(caktoEmail);
      if (res.success) {
        setMessage(res.message || "Compra sincronizada com sucesso!");
        // Aguarda 1.5 segundos e recarrega a página para aplicar o plano FULL
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(res.error || "Não foi possível sincronizar o seu acesso.");
      }
    } catch (err: any) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Decorative premium glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black tracking-widest uppercase mb-4 animate-pulse">
            <Shield className="w-3.5 h-3.5" />
            Pagamento Requerido
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Acesso <span className="text-gradient">Pendente</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-md mx-auto leading-relaxed">
            Seu cadastro foi realizado! No entanto, não localizamos um pagamento aprovado para este e-mail na Cakto.
          </p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[3.5rem] border border-white/5 space-y-8 bg-zinc-950/40 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Box 1: Checkout */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                  ACESSO VITALÍCIO
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">Liberar Cripta do Vault</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Garanta acesso ilimitado à biblioteca de prompts, templates premium de código e aulas de automação exclusivas.
                </p>
              </div>

              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Preço Único</span>
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-sm font-bold">R$</span>
                  <span className="text-4xl font-black tracking-tighter text-gradient">97</span>
                  <span className="text-xs font-bold text-zinc-500">,00</span>
                </div>
              </div>

              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-primary hover:bg-accent text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 text-center"
              >
                <DollarSign className="w-4 h-4" />
                ATIVAR VITALÍCIO AGORA
              </a>
            </div>

            {/* Box 2: Sync Access */}
            <div className="p-6 rounded-[2rem] bg-black/60 border border-white/5 flex flex-col space-y-4">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Já realizou o pagamento?</h4>
                <p className="text-[10px] text-zinc-500 leading-normal mt-1">
                  Se comprou com outro e-mail ou se o pagamento foi aprovado agora, sincronize abaixo:
                </p>
              </div>

              <form onSubmit={handleSync} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="email"
                    value={caktoEmail}
                    onChange={(e) => setCaktoEmail(e.target.value)}
                    placeholder="E-mail usado na compra"
                    className="w-full bg-secondary border border-border rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-primary/50 text-white transition-all text-xs"
                    required
                    disabled={loading}
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-[10px] bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 font-semibold leading-normal">
                    {error}
                  </p>
                )}

                {message && (
                  <p className="text-emerald-400 text-[10px] bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 font-semibold leading-normal flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    {message}
                  </p>
                )}

                <button
                  disabled={loading}
                  className="w-full py-3.5 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading && "animate-spin"}`} />
                  SINCRONIZAR ACESSO
                </button>
              </form>
            </div>

          </div>

          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Logado como: <span className="text-zinc-400">{email}</span>
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              SAIR DA CONTA
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
