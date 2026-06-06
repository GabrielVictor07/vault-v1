"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { verifyAdminMasterKey } from "@/app/actions/settings";

export default function AdminAuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Verificação da Chave Mestra no servidor (Evita credencial exposta no frontend)
    const masterKeyCheck = await verifyAdminMasterKey(secretKey);
    if (!masterKeyCheck.success) {
      setError(masterKeyCheck.error || "Chave mestra inválida. Acesso negado.");
      setLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao autenticar. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10 space-y-3">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
             <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Vault <span className="text-primary">Master</span></h1>
          <p className="text-zinc-500 text-sm">Painel de Controle Administrativo</p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-zinc-900/30 border border-white/10 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">E-mail de Administrador</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                placeholder="adm@vault.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all pr-12"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Chave Mestra (Secret)</label>
              <div className="relative">
                <input 
                  type="password"
                  required
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-primary/5 border border-primary/20 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="Master Key"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ACESSAR TERMINAL MASTER"}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
          Ambiente restrito e monitorado • Vault v1.0
        </p>
      </motion.div>
    </div>
  );
}
