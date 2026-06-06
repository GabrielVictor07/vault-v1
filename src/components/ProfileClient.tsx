"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Edit3, 
  CheckCircle2, 
  Loader2,
  Camera,
  AtSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateUserProfile } from "@/app/actions/user";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
  initialUser: {
    id: string;
    email: string;
    name: string | null;
    nickname: string | null;
    phone: string | null;
    image: string | null;
    plan: string;
    status: string;
    createdAt: string;
    lastSignIn: string | null;
  };
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialUser.name || "");
  const [nickname, setNickname] = useState(initialUser.nickname || "");
  const [phone, setPhone] = useState(initialUser.phone || "");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    
    const res = await updateUserProfile({ name, nickname, phone });
    setLoading(false);
    
    if (res.success) {
      setSuccessMsg("Perfil atualizado com sucesso!");
      setIsEditing(false);
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      alert("Erro ao atualizar perfil: " + res.error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "Nenhum acesso registrado";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "ACTIVE" || s === "ATIVA") {
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          Ativa
        </span>
      );
    }
    if (s === "PENDING" || s === "PENDENTE") {
      return (
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">
          Pendente
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest border border-red-500/20">
        Expirada
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row items-center gap-8 bg-zinc-950/40 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* User Image Area */}
        <div className="relative">
          <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-zinc-900 flex items-center justify-center border-2 border-white/5 overflow-hidden shadow-2xl transition-all group-hover:border-primary/30">
            {initialUser.image ? (
              <img src={initialUser.image} alt={initialUser.name || ""} className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-primary/80 group-hover:scale-105 transition-transform" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 p-3 rounded-2xl bg-white text-black shadow-xl scale-90 group-hover:scale-100 transition-all opacity-0 group-hover:opacity-100 active:scale-95">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        
        {/* Basic Header Details */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">{initialUser.name || "Usuário Vault"}</h1>
            {getStatusBadge(initialUser.status)}
          </div>
          <p className="text-zinc-500 font-bold text-sm tracking-wider uppercase">@{initialUser.nickname || initialUser.email.split("@")[0]}</p>
          <p className="text-zinc-400 font-medium text-xs flex items-center justify-center md:justify-start gap-1.5 pt-1">
            <Mail className="w-3.5 h-3.5 text-zinc-600" />
            {initialUser.email}
          </p>
        </div>

        <button 
          onClick={() => setIsEditing(true)}
          className="px-8 py-4 rounded-2xl bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95"
        >
          <Edit3 className="w-4 h-4" />
          EDITAR DADOS
        </button>
      </header>

      {/* Edit Form Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Editar Perfil</h3>
                <p className="text-xs text-zinc-500">Atualize suas informações visíveis no sistema.</p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Nome completo */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nome Completo</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Seu nome"
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 text-white transition-all"
                  />
                </div>

                {/* Nickname */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nome público / Apelido</label>
                  <input 
                    type="text" 
                    value={nickname} 
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Ex: gabriel_motta"
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 text-white transition-all"
                  />
                </div>

                {/* Telefone/WhatsApp */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: (11) 99999-9999"
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 text-white transition-all"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-2xl text-xs font-bold uppercase transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-primary hover:bg-accent text-white rounded-2xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Details Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Informações Pessoais */}
        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/20 space-y-6">
          <h3 className="text-base font-bold text-zinc-300 border-b border-white/5 pb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Informações Pessoais
          </h3>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Nome Completo</span>
              <p className="text-sm font-bold text-white mt-1">{initialUser.name || "Não informado"}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Nome Público / Apelido</span>
              <p className="text-sm font-bold text-primary mt-1 flex items-center gap-1">
                <AtSign className="w-4 h-4 text-primary/60" />
                {initialUser.nickname || "Não informado"}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Telefone / WhatsApp</span>
              <p className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                <Phone className="w-4 h-4 text-zinc-600" />
                {initialUser.phone || "Não informado"}
              </p>
            </div>
          </div>
        </div>

        {/* Informações da Conta */}
        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/20 space-y-6">
          <h3 className="text-base font-bold text-zinc-300 border-b border-white/5 pb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            Status & Segurança da Conta
          </h3>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">E-mail Vinculado</span>
              <p className="text-sm font-bold text-zinc-300 mt-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-600" />
                {initialUser.email}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Status do Cadastro</span>
                <div className="mt-1">{getStatusBadge(initialUser.status)}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Plano de Acesso</span>
                <p className="text-sm font-black text-primary mt-1 uppercase tracking-widest">{initialUser.plan}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                  Criação
                </span>
                <p className="text-xs font-bold text-zinc-400 mt-1">{formatDate(initialUser.createdAt)}</p>
              </div>

              <div>
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-600" />
                  Último Acesso
                </span>
                <p className="text-xs font-bold text-zinc-400 mt-1">{formatDateTime(initialUser.lastSignIn)}</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
