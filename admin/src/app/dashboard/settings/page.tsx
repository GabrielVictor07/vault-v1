"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  ShieldAlert, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Database, 
  Globe, 
  Link as LinkIcon, 
  ToggleLeft, 
  ToggleRight, 
  Loader2,
  Cpu,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getAdminSession, 
  updateAdminPassword, 
  updateAdminProfile, 
  getSystemDiagnostics,
  getSystemConfig,
  saveSystemConfig,
  simulateCaktoSale
} from "@/app/actions/settings";

export default function SettingsPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  
  // Forms states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("https://checkout.cakto.com.br/vault-premium");
  
  // Toggles
  const [allowSignups, setAllowSignups] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Simulator states
  const [simEmail, setSimEmail] = useState("");
  const [simulating, setSimulating] = useState(false);
  
  // Status states
  const [loading, setLoading] = useState(true);
  const [updatingCreds, setUpdatingCreds] = useState(false);
  const [updatingSystem, setUpdatingSystem] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" as "success" | "error" | "" });

  const handleSimulateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simEmail.trim()) {
      setMessage({ text: "Por favor, insira um e-mail para simulação.", type: "error" });
      return;
    }
    setSimulating(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await simulateCaktoSale(simEmail);
      if (res.success) {
        setMessage({ text: res.message || "Venda simulada com sucesso!", type: "success" });
        setSimEmail("");
        // Atualiza diagnósticos
        fetchSettingsData();
      } else {
        throw new Error(res.error || "Erro na simulação.");
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSimulating(false);
    }
  };

  const fetchSettingsData = async () => {
    setLoading(true);
    const [session, diag, config] = await Promise.all([
      getAdminSession(),
      getSystemDiagnostics(),
      getSystemConfig()
    ]);
    
    if (session) {
      setAdmin(session);
      setEmail(session.email || "");
    }
    if (diag) {
      setDiagnostics(diag);
    }
    if (config) {
      setAllowSignups(config.allowSignups);
      setMaintenanceMode(config.maintenanceMode);
      setCheckoutUrl(config.checkoutUrl);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setUpdatingCreds(true);

    try {
      if (email !== admin?.email) {
        const res = await updateAdminProfile(email);
        if (!res.success) throw new Error(res.error || "Erro ao atualizar email");
      }

      if (password) {
        if (password !== confirmPassword) {
          throw new Error("As senhas informadas não coincidem.");
        }
        if (password.length < 6) {
          throw new Error("A nova senha deve conter pelo menos 6 caracteres.");
        }
        const res = await updateAdminPassword(password);
        if (!res.success) throw new Error(res.error || "Erro ao atualizar senha");
      }

      setMessage({ text: "Credenciais de administrador atualizadas com sucesso!", type: "success" });
      setPassword("");
      setConfirmPassword("");
      fetchSettingsData();
    } catch (err: any) {
      setMessage({ text: err.message || "Erro ao salvar alterações.", type: "error" });
    } finally {
      setUpdatingCreds(false);
    }
  };

  const handleSaveSystemConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingSystem(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await saveSystemConfig(allowSignups, maintenanceMode, checkoutUrl);
      if (!res.success) {
        throw new Error(res.error || "Erro ao salvar configurações do sistema");
      }
      setMessage({ text: "Configurações gerais do ecossistema salvas com sucesso!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message || "Erro ao salvar alterações.", type: "error" });
    } finally {
      setUpdatingSystem(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
        <p className="text-zinc-500 font-bold tracking-widest text-xs uppercase animate-pulse">Carregando painel de configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações do <span className="text-primary">Sistema</span></h1>
          <p className="text-zinc-500 mt-1">Ajuste de integrações, controle de acessos e segurança master.</p>
        </div>
        <button 
          onClick={fetchSettingsData}
          className="p-3 bg-zinc-950 border border-white/5 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all active:scale-95"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </header>

      {/* Global alert feedback messages */}
      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "p-6 rounded-[2rem] border flex items-center gap-4 text-sm font-bold",
              message.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            )}
          >
            {message.type === "success" ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            <span className="flex-1">{message.text}</span>
            <button 
              onClick={() => setMessage({ text: "", type: "" })}
              className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100"
            >
              FECHAR
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: GENERAL SETTINGS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Platform Settings */}
          <section className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/40 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" />
              Parâmetros de Integração & SaaS
            </h3>

            <form onSubmit={handleSaveSystemConfig} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-zinc-600" />
                  Checkout Cakto (Plano Vitalício)
                </label>
                <input 
                  type="url"
                  value={checkoutUrl}
                  onChange={(e) => setCheckoutUrl(e.target.value)}
                  placeholder="https://checkout.cakto.com.br/..."
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 text-white transition-all"
                  required
                />
              </div>

              {/* Toggles grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Toggle signups */}
                <div className="p-6 rounded-3xl bg-zinc-900/20 border border-white/5 flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <p className="text-sm font-bold text-white">Novos Cadastros</p>
                    <p className="text-xs text-zinc-500">Permite que novos clientes se registrem.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setAllowSignups(!allowSignups)}
                    className="text-zinc-400 hover:text-white transition-all"
                  >
                    {allowSignups ? (
                      <ToggleRight className="w-12 h-12 text-primary" />
                    ) : (
                      <ToggleLeft className="w-12 h-12 text-zinc-700" />
                    )}
                  </button>
                </div>

                {/* Toggle maintenance */}
                <div className="p-6 rounded-3xl bg-zinc-900/20 border border-white/5 flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <p className="text-sm font-bold text-white">Modo de Manutenção</p>
                    <p className="text-xs text-zinc-500">Bloqueia o app para manutenção.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className="text-zinc-400 hover:text-white transition-all"
                  >
                    {maintenanceMode ? (
                      <ToggleRight className="w-12 h-12 text-amber-500" />
                    ) : (
                      <ToggleLeft className="w-12 h-12 text-zinc-700" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  disabled={updatingSystem}
                  className="px-8 py-4 bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-primary/10 flex items-center gap-2 active:scale-95"
                >
                  {updatingSystem ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Parâmetros"}
                </button>
              </div>
            </form>
          </section>

          {/* Master Admin Authentication & Security */}
          <section className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/40 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <Lock className="w-5 h-5 text-purple-400" />
              Segurança & Conta Master Admin
            </h3>

            <form onSubmit={handleUpdateCredentials} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-600" />
                    E-mail do Administrador
                  </label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 text-white transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-zinc-600" />
                    Nível de Autorização
                  </label>
                  <div className="w-full bg-zinc-900/20 border border-white/5 rounded-2xl py-4 px-6 text-sm text-zinc-400 select-none">
                    Master Admin (Acesso Root)
                  </div>
                </div>

              </div>

              <div className="border-t border-white/5 my-6 pt-6" />

              <div className="space-y-2">
                <p className="text-sm font-bold text-white">Alterar Senha de Acesso</p>
                <p className="text-xs text-zinc-500">Deixe em branco se não desejar alterar a senha atual.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Nova Senha</label>
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 caracteres"
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 text-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Confirmar Senha</label>
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 text-white transition-all"
                  />
                </div>

              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  disabled={updatingCreds}
                  className="px-8 py-4 bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-primary/10 flex items-center gap-2 active:scale-95"
                >
                  {updatingCreds ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar Credenciais"}
                </button>
              </div>
            </form>
          </section>

        </div>

        {/* RIGHT COLUMN: DIAGNOSTICS & SYSTEM STATUS */}
        <div className="space-y-8">
          
          <section className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/40 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <Cpu className="w-5 h-5 text-emerald-400" />
              Integridade & Diagnósticos
            </h3>

            <div className="space-y-6">
              
              {/* Database status */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/20 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Database className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-zinc-300">Banco de Dados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    {diagnostics?.databaseStatus === "Operational" ? "OPERACIONAL" : "ERRO"}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
              </div>

              {/* Supabase status */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/20 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Server className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-zinc-300">Autenticação (Supabase)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">OPERACIONAL</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
              </div>

              {/* Webhook Cakto status */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/20 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-zinc-300">Serviço Webhook</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">OPERACIONAL</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
              </div>

              <div className="border-t border-white/5 my-4 pt-4 space-y-4">
                <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  <span>Versão do SaaS</span>
                  <span className="text-white">{diagnostics?.systemVersion}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  <span>Ambiente</span>
                  <span className="text-primary font-black uppercase">{diagnostics?.environment}</span>
                </div>
              </div>

            </div>
          </section>

          {/* Quick System Stats */}
          <section className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/40 space-y-6">
            <h3 className="text-lg font-bold text-zinc-300">
              Registros no Banco
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/20 border border-white/5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Usuários</span>
                <p className="text-xl font-bold mt-1 text-white">{diagnostics?.stats.usersCount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/20 border border-white/5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vídeos</span>
                <p className="text-xl font-bold mt-1 text-white">{diagnostics?.stats.videosCount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/20 border border-white/5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Prompts</span>
                <p className="text-xl font-bold mt-1 text-white">{diagnostics?.stats.promptsCount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/20 border border-white/5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Templates</span>
                <p className="text-xl font-bold mt-1 text-white">{diagnostics?.stats.templatesCount}</p>
              </div>
            </div>
          </section>

          {/* Simulador de Vendas Cakto */}
          <section className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/40 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <Cpu className="w-5 h-5 text-primary" />
              Simulador de Vendas Cakto
            </h3>
            
            <p className="text-xs text-zinc-500 leading-relaxed">
              Use este simulador para testar a sincronização de acessos e a aprovação automática de planos FULL via e-mail sem precisar de ferramentas externas.
            </p>

            <form onSubmit={handleSimulateSale} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">E-mail do Comprador</label>
                <input 
                  type="email"
                  value={simEmail}
                  onChange={(e) => setSimEmail(e.target.value)}
                  placeholder="ex: gabriel@cakto.com"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 text-white transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={simulating}
                className="w-full py-4 bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 active:scale-95"
              >
                {simulating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simular Pagamento Aprovado"}
              </button>
            </form>
          </section>

        </div>

      </div>
    </div>
  );
}
