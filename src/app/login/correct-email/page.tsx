"use client";

import { useState } from "react";
import { correctPurchaseEmail } from "@/app/actions/authSupport";
import { motion } from "framer-motion";
import { Shield, Mail, Hash, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CorrectEmailPage() {
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [purchaseId, setPurchaseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCorrectEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await correctPurchaseEmail(oldEmail, newEmail, purchaseId);
      if (res.success) {
        setMessage(res.message || "E-mail alterado com sucesso!");
        setOldEmail("");
        setNewEmail("");
        setPurchaseId("");
      } else {
        setError(res.error || "Erro ao corrigir e-mail.");
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
          <h1 className="text-3xl font-black text-white text-gradient">E-mail Incorreto</h1>
          <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
            Se digitou o e-mail errado na hora da compra, informe os dados abaixo para corrigir.
          </p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <form onSubmit={handleCorrectEmail} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider">E-mail Usado na Compra</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  value={oldEmail}
                  onChange={(e) => setOldEmail(e.target.value)}
                  placeholder="email-errado@provedor.com"
                  className="w-full bg-secondary border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all text-sm"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider">Novo E-mail Correto</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="seu-email-certo@provedor.com"
                  className="w-full bg-secondary border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all text-sm"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider">ID da Compra / Pedido</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={purchaseId}
                  onChange={(e) => setPurchaseId(e.target.value)}
                  placeholder="Código do pedido Cakto"
                  className="w-full bg-secondary border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all text-sm"
                  required
                  disabled={loading}
                />
              </div>
              <span className="text-[10px] text-zinc-500 block ml-1 leading-normal">
                Você encontra o ID da compra no e-mail de confirmação de pagamento enviado pela Cakto.
              </span>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs bg-red-500/10 p-4 rounded-2xl border border-red-500/20 font-semibold leading-relaxed"
              >
                {error}
              </motion.p>
            )}

            {message && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-emerald-400 text-xs bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 font-semibold leading-relaxed"
              >
                {message}
              </motion.p>
            )}

            <button
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98] mt-2"
            >
              {loading ? "Corrigindo..." : "CORRIGIR E-MAIL E ENVIAR"}
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
