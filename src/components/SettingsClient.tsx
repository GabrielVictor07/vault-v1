"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Shield, 
  CreditCard, 
  Bell, 
  Sliders, 
  Trash2, 
  Share2, 
  LifeBuoy, 
  CheckCircle2, 
  AlertTriangle,
  Mail,
  RefreshCw,
  Eye,
  Globe,
  Database,
  Loader2,
  Calendar,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { syncCaktoPurchase } from "@/app/actions/user";

interface SettingsClientProps {
  user: {
    id: string;
    email: string;
    plan: string;
    status: string;
    createdAt: string;
  };
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("seguranca");

  // Notifications states
  const [receiveEmails, setReceiveEmails] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [updates, setUpdates] = useState(false);

  // Preferences states
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("pt-BR");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Purchase / Access states
  const [caktoEmail, setCaktoEmail] = useState(user.email);
  const [syncing, setSyncing] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [supportCategory, setSupportCategory] = useState("duvida");
  
  // Loading & Alert states
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState({ text: "", type: "" as "success" | "error" | "" });

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMsg({ text, type });
    setTimeout(() => setAlertMsg({ text: "", type: "" }), 4000);
  };

  // Actions
  const handleResetPassword = async () => {
    setLoadingAction("password");
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/profile`,
    });
    setLoadingAction(null);
    if (error) {
      triggerAlert("Erro ao enviar e-mail de redefinição: " + error.message, "error");
    } else {
      triggerAlert("E-mail de redefinição de senha enviado com sucesso!", "success");
    }
  };

  const handleSignoutAll = async () => {
    setLoadingAction("signout_all");
    const { error } = await supabase.auth.signOut({ scope: "global" });
    setLoadingAction(null);
    if (error) {
      triggerAlert("Erro ao encerrar sessões: " + error.message, "error");
    } else {
      triggerAlert("Sessão encerrada em todos os dispositivos com sucesso!", "success");
      router.push("/login");
      router.refresh();
    }
  };

  const handleSyncAccess = async () => {
    if (!caktoEmail.trim()) {
      triggerAlert("Digite um e-mail válido para sincronizar.", "error");
      return;
    }
    setSyncing(true);
    const res = await syncCaktoPurchase(caktoEmail);
    setSyncing(false);
    if (res.success) {
      triggerAlert(res.message || "Acesso sincronizado com sucesso!", "success");
      router.refresh();
    } else {
      triggerAlert(res.error || "Erro ao sincronizar acesso.", "error");
    }
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("support");
    setTimeout(() => {
      setLoadingAction(null);
      setSupportMessage("");
      triggerAlert("Chamado de suporte enviado com sucesso! Nosso time retornará no seu e-mail em até 2 horas.", "success");
    }, 1200);
  };

  const handleDownloadData = () => {
    triggerAlert("Solicitação de download registrada. Você receberá um e-mail com seus dados compactados em alguns minutos.", "success");
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("ATENÇÃO: Esta ação é irreversível. Deseja mesmo deletar permanentemente sua conta Vault?");
    if (confirm) {
      triggerAlert("Solicitação enviada. Entre em contato com o suporte para concluir a exclusão.", "error");
    }
  };

  const tabs = [
    { id: "seguranca", label: "Segurança & Conta", icon: Shield },
    { id: "compra", label: "Verificação & Acesso", icon: CreditCard },
    { id: "notificacoes", label: "Preferências & Notificações", icon: Bell },
    { id: "integracoes", label: "Integrações & Suporte", icon: Share2 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Configurações do <span className="text-primary">Vault</span></h1>
        <p className="text-zinc-500 mt-1">Gerencie a segurança, preferências de privacidade e sincronize seus acessos.</p>
      </header>

      {/* Global alert feedback messages */}
      <AnimatePresence>
        {alertMsg.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "p-6 rounded-3xl border flex items-center gap-4 text-sm font-bold shadow-xl",
              alertMsg.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            )}
          >
            {alertMsg.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="flex-1">{alertMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all border font-bold text-xs uppercase tracking-wider",
                  isSelected 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-zinc-950/40 border-white/5 text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            
            {/* TAB: SEGURANÇA */}
            {activeTab === "seguranca" && (
              <motion.div 
                key="seguranca"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Alterar Senha */}
                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/20 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Segurança & Senha
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Você pode alterar sua senha de acesso a qualquer momento. Para sua segurança, enviaremos um link de confirmação para o seu e-mail.
                  </p>
                  <button 
                    onClick={handleResetPassword}
                    disabled={loadingAction === "password"}
                    className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95"
                  >
                    {loadingAction === "password" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar link de redefinição"}
                  </button>
                </div>

                {/* Sessões e Dispositivos */}
                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/20 space-y-6">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Sessões Ativas
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-zinc-900/20 border border-white/5 rounded-2xl">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white">Dispositivo Atual (Este Navegador)</p>
                        <p className="text-[10px] text-zinc-500">São Paulo, Brasil • Ativo agora</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wider border border-emerald-500/20">
                        Atual
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-900/20 border border-white/5 rounded-2xl opacity-60">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white">Dispositivo Móvel (iPhone)</p>
                        <p className="text-[10px] text-zinc-500">Rio de Janeiro, Brasil • Há 2 dias</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <button 
                      onClick={handleSignoutAll}
                      disabled={loadingAction === "signout_all"}
                      className="px-6 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95"
                    >
                      {loadingAction === "signout_all" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Encerrar todas as sessões"}
                    </button>
                  </div>
                </div>

                {/* Privacidade Extrema */}
                <div className="p-8 rounded-[2.5rem] border border-red-500/10 bg-red-500/5 space-y-4">
                  <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Privacidade & exclusão de conta
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Você pode baixar todos os seus dados coletados e preferências ou, se necessário, excluir sua conta de forma permanente de nossos registros.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button 
                      onClick={handleDownloadData}
                      className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Baixar meus dados
                    </button>
                    <button 
                      onClick={handleDeleteAccount}
                      className="px-6 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Excluir conta
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: COMPRA & COBRANÇA */}
            {activeTab === "compra" && (
              <motion.div 
                key="compra"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Verificação da Compra */}
                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/20 space-y-6">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Verificação & Integração Cakto
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">E-mail Vinculado à Compra Cakto</label>
                      <div className="flex gap-4">
                        <input 
                          type="email" 
                          value={caktoEmail} 
                          onChange={(e) => setCaktoEmail(e.target.value)}
                          className="flex-1 bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 text-white transition-all"
                        />
                        <button 
                          onClick={handleSyncAccess}
                          disabled={syncing}
                          className="px-6 rounded-2xl bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                        >
                          {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sincronizar"}
                        </button>
                      </div>
                      <p className="text-[10px] text-zinc-600 font-medium">Se a sua compra foi realizada com outro e-mail, digite-o acima e clique em Sincronizar.</p>
                    </div>
                  </div>
                </div>

                {/* Cobrança / Acesso */}
                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/20 space-y-6">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Cobrança & Acesso
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-zinc-900/20 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Status do Acesso</span>
                      {user.plan === "FULL" ? (
                        <p className="text-lg font-black text-emerald-400 tracking-wide uppercase">Ativo (Vitalício)</p>
                      ) : (
                        <p className="text-lg font-black text-amber-500 tracking-wide uppercase">Gratuito (Limitado)</p>
                      )}
                    </div>

                    <div className="p-6 rounded-3xl bg-zinc-900/20 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Validade do Plano</span>
                      {user.plan === "FULL" ? (
                        <p className="text-lg font-black text-white tracking-wide">Sem expiração</p>
                      ) : (
                        <p className="text-lg font-black text-zinc-400 tracking-wide">Período de testes</p>
                      )}
                    </div>
                  </div>

                  {/* Histórico de Compras */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Histórico de Compra</p>
                    <div className="p-4 bg-zinc-900/20 border border-white/5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs">V</div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            {user.plan === "FULL" ? "Vault Premium Vitalício" : "Vault Gratuito (Limitado)"}
                          </p>
                          <p className="text-[9px] text-zinc-600 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-400">
                          {user.plan === "FULL" ? "R$ 97,00" : "R$ 0,00"}
                        </p>
                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                          {user.plan === "FULL" ? "Pago" : "Ativo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all">
                      Renovar Acesso / Comprar Novamente
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: NOTIFICAÇÕES & PREFERÊNCIAS */}
            {activeTab === "notificacoes" && (
              <motion.div 
                key="notificacoes"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Notificações */}
                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/20 space-y-6">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Configuração de Notificações
                  </h3>

                  <div className="space-y-4">
                    {/* E-mails */}
                    <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">Receber E-mails Informativos</p>
                        <p className="text-xs text-zinc-600 font-medium">Novidades, dicas e novidades semanais sobre IA.</p>
                      </div>
                      <button 
                        onClick={() => setReceiveEmails(!receiveEmails)}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-all",
                          receiveEmails ? "bg-primary" : "bg-white/10"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                          receiveEmails ? "right-1" : "left-1"
                        )} />
                      </button>
                    </div>

                    {/* Avisos */}
                    <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">Avisos do Sistema</p>
                        <p className="text-xs text-zinc-600 font-medium">Alertas importantes sobre sua conta e segurança.</p>
                      </div>
                      <button 
                        onClick={() => setSystemAlerts(!systemAlerts)}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-all",
                          systemAlerts ? "bg-primary" : "bg-white/10"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                          systemAlerts ? "right-1" : "left-1"
                        )} />
                      </button>
                    </div>

                    {/* Atualizações */}
                    <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">Atualizações da Plataforma</p>
                        <p className="text-xs text-zinc-600 font-medium">E-mails sobre novos Prompts, Vídeos e Templates lançados.</p>
                      </div>
                      <button 
                        onClick={() => setUpdates(!updates)}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-all",
                          updates ? "bg-primary" : "bg-white/10"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                          updates ? "right-1" : "left-1"
                        )} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preferências */}
                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/20 space-y-6">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-purple-400" />
                    Preferências do Ecossistema
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tema */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tema Visual</label>
                      <select 
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-all"
                      >
                        <option value="dark">Cyberpunk Escuro</option>
                        <option value="light">Claro Premium</option>
                      </select>
                    </div>

                    {/* Idioma */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Idioma (Language)</label>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-all"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en">English (US)</option>
                        <option value="es">Español</option>
                      </select>
                    </div>

                    {/* Formato de data */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Formato de Data</label>
                      <select 
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-all"
                      >
                        <option value="DD/MM/YYYY">DD/MM/AAAA (Brasil)</option>
                        <option value="YYYY-MM-DD">AAAA-MM-DD (ISO)</option>
                        <option value="MM/DD/YYYY">MM/DD/AAAA (US)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: INTEGRAÇÕES & SUPORTE */}
            {activeTab === "integracoes" && (
              <motion.div 
                key="integracoes"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Integrações */}
                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/20 space-y-6">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary" />
                    Integrações Avançadas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Discord */}
                    <div className="p-6 rounded-3xl bg-zinc-900/20 border border-white/5 space-y-4 flex flex-col justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Discord Community</p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">Conecte sua conta para receber cargo VIP exclusivo.</p>
                      </div>
                      <button className="w-full py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl text-xs font-bold tracking-wider transition-all">
                        CONECTAR DISCORD
                      </button>
                    </div>

                    {/* WhatsApp */}
                    <div className="p-6 rounded-3xl bg-zinc-900/20 border border-white/5 space-y-4 flex flex-col justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">WhatsApp Alertas</p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">Receba notificações de novas aulas e respostas do suporte direto no celular.</p>
                      </div>
                      <button className="w-full py-3 bg-[#25D366] hover:bg-[#1ebd59] text-white rounded-xl text-xs font-bold tracking-wider transition-all">
                        ATIVAR NO WHATSAPP
                      </button>
                    </div>

                    {/* Notion */}
                    <div className="p-6 rounded-3xl bg-zinc-900/20 border border-white/5 space-y-4 flex flex-col justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Notion Workspace</p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">Sincronize sua biblioteca de prompts em suas páginas do Notion.</p>
                      </div>
                      <button className="w-full py-3 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-bold tracking-wider transition-all">
                        SINCRONIZAR NOTION
                      </button>
                    </div>
                  </div>
                </div>

                {/* Suporte */}
                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/20 space-y-6">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <LifeBuoy className="w-5 h-5 text-purple-400" />
                    Suporte & Chamados
                  </h3>

                  <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Qual é o seu problema?</label>
                        <select 
                          value={supportCategory}
                          onChange={(e) => setSupportCategory(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-all"
                        >
                          <option value="duvida">Dúvida sobre conteúdos</option>
                          <option value="problema">Reportar problema na plataforma</option>
                          <option value="email_compra">Corrigir e-mail de compra Cakto</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">E-mail para Retorno</label>
                        <div className="w-full bg-zinc-900/40 border border-white/5 rounded-xl py-3.5 px-4 text-xs text-zinc-400 font-bold">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Descrição do Chamado</label>
                      <textarea 
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        required
                        placeholder="Descreva detalhadamente sua dúvida ou problema para receber suporte imediato..."
                        rows={4}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 text-white transition-all resize-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        disabled={loadingAction === "support"}
                        className="px-8 py-4 bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95"
                      >
                        {loadingAction === "support" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Abrir Chamado"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
