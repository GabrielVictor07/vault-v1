"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, HelpCircle, User as UserIcon, X, Check, MessageSquare, Info, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface TopbarClientProps {
  displayName: string;
  displayPlan: string;
}

export function TopbarClient({ displayName, displayPlan }: TopbarClientProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Acesso Premium Vitalício Ativado", desc: "Sua conta foi promovida ao plano FULL. Aproveite todos os prompts, vídeos e templates!", read: false, time: "Agora" },
    { id: 2, title: "Nova Masterclass Liberada", desc: "A aula 'Criando UI de Alta Conversão com Midjourney' já está disponível.", read: false, time: "Há 2 horas" },
    { id: 3, title: "Atualização da Plataforma", desc: "Instabilidade corrigida e simulador de pagamentos adicionado com sucesso.", read: true, time: "Há 1 dia" }
  ]);

  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <>
      <header className="h-20 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-40">
        {/* Left spacing to keep layout balanced without search bar */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Painel do Membro</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 relative">
            
            {/* Help / ? Button */}
            <button 
              onClick={() => setShowSupport(true)}
              className="p-3 hover:bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all active:scale-95"
              title="Ajuda & Suporte"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Notification / Bell Button */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 hover:bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all relative active:scale-95"
                title="Notificações"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-primary rounded-full border-2 border-black" />
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 rounded-[2rem] border border-white/5 bg-zinc-950/95 backdrop-blur-2xl shadow-2xl p-6 space-y-4 z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white">Notificações</p>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllRead}
                          className="text-[9px] font-black text-primary uppercase tracking-wider hover:underline"
                        >
                          Marcar como lidas
                        </button>
                      )}
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-4 rounded-2xl border transition-all text-left space-y-1 ${
                            n.read 
                              ? "bg-zinc-900/10 border-white/5 opacity-60" 
                              : "bg-primary/5 border-primary/10 shadow-[0_0_15px_rgba(255,45,141,0.02)]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              n.id === 1 ? "bg-emerald-500/10 text-emerald-400" : "bg-primary/10 text-primary"
                            }`}>
                              {n.time}
                            </span>
                            {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                          </div>
                          <p className="text-xs font-bold text-zinc-100">{n.title}</p>
                          <p className="text-[11px] text-zinc-500 leading-relaxed">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Profile Click Navigation */}
          <Link href="/dashboard/profile">
            <div className="flex items-center gap-4 pl-6 border-l border-white/5 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black tracking-tight text-zinc-300 group-hover:text-white transition-colors">{displayName}</p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{displayPlan}</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/10 p-0.5 group-hover:border-primary/50 transition-all shadow-xl">
                <div className="w-full h-full rounded-[0.9rem] bg-gradient-to-br from-primary/20 to-zinc-800 flex items-center justify-center overflow-hidden">
                  <UserIcon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Support / Help Modal Overlay */}
      <AnimatePresence>
        {showSupport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSupport(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-[2.5rem] border border-white/5 bg-zinc-950 p-8 text-center space-y-6 shadow-2xl overflow-hidden"
            >
              {/* Decorative glows */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />

              <button 
                onClick={() => setShowSupport(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center pt-2">
                <div className="w-16 h-16 rounded-[1.3rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
                  <MessageSquare className="w-7 h-7" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Suporte & Central de Ajuda</h3>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                  Precisa de ajuda com o Vault? Nosso suporte de elite está online para responder a qualquer dúvida técnica ou de acesso.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a 
                  href="https://wa.me/5500000000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chamar Suporte no WhatsApp
                </a>
                <a 
                  href="mailto:suporte@cakto.com.br"
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/5"
                >
                  <Info className="w-4 h-4" />
                  Enviar E-mail de Ajuda
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/5 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Vault 1.0 - Suporte Prioritário
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
