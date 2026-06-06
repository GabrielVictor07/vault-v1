"use client";

import { useState } from "react";
import { resendAccessLink } from "@/app/actions/authSupport";
import { motion } from "framer-motion";
import { Shield, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResendPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await resendAccessLink(email);
      if (res.success) {
        setMessage(res.message || "Acesso reenviado!");
        setEmail("");
      } else {
        setError(res.error || "Ocorreu um erro.");
      }
    } catch (err: any) {
      setError("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-black tracking-tighter text-white">VAULT 1.0</span>
          </Link>
          <h1 className="text-3xl font-black text-white">Reenviar Acesso</h1>
          <p className="text-zinc-400 mt-2">
            Informe o e-mail que você usou para comprar na Cakto.
          </p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <form onSubmit={handleResend} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider">E-mail da Compra</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email-usado-na-compra@provedor.com"
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

            {message && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-emerald-400 text-xs bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 font-semibold"
              >
                {message}
              </motion.p>
            )}

            <button
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98] mt-2"
            >
              {loading ? "Verificando..." : "VERIFICAR E REENVIAR"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="pt-2 border-t border-border/30 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar para o Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
