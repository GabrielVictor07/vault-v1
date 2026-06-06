"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Video, 
  Layout, 
  Star, 
  ArrowUpRight, 
  TrendingUp, 
  Sparkles, 
  Play, 
  ChevronRight,
  Clock,
  Layers,
  Search
} from "lucide-react";
import { getDashboardData } from "@/app/actions/content";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData().then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
        <p className="text-zinc-500 font-bold tracking-widest text-xs uppercase animate-pulse">Iniciando seu vault premium...</p>
      </div>
    );
  }

  const metrics = [
    { label: "Prompts", value: data.metrics.prompts, icon: Terminal, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Vídeos", value: data.metrics.videos, icon: Video, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Templates", value: data.metrics.templates, icon: Layout, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Favoritos", value: data.metrics.favorites, icon: Star, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero / Welcome Section */}
      <section className="relative p-10 md:p-16 rounded-[3rem] bg-zinc-950 border border-white/5 overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-6 max-w-2xl text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]"
            >
              <Sparkles className="w-3 h-3 text-primary" />
              Acesso Premium Ativado
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]"
            >
              Domine a <span className="text-gradient">Inteligência Artificial</span> do Zero ao Avançado.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed"
            >
              Bem-vindo ao Vault 1.0. Sua biblioteca definitiva de prompts estratégicos, videoaulas exclusivas e ferramentas de design.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4"
            >
              <Link href="/dashboard/videos">
                <button className="px-8 py-4 rounded-2xl bg-primary hover:bg-accent text-white font-bold text-sm transition-all shadow-xl shadow-primary/20 flex items-center gap-3">
                  COMEÇAR AGORA <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/dashboard/prompts">
                <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm transition-all">
                  EXPLORAR PROMPTS
                </button>
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full md:w-auto flex justify-center"
          >
             {data.lastVideoWatched ? (
               <Link href={`/dashboard/videos/${data.lastVideoWatched.id}`} className="relative group/vid block cursor-pointer">
                 <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-3xl group-hover/vid:bg-primary/40 transition-all" />
                 <div className="relative w-full md:w-64 aspect-video md:aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center">
                    {data.lastVideoWatched.thumbnail ? (
                      <img 
                        src={data.lastVideoWatched.thumbnail} 
                        alt={data.lastVideoWatched.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover/vid:scale-105 transition-transform duration-500 pointer-events-none"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-zinc-900/50" />
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover/vid:bg-black/20 transition-all flex items-center justify-center z-10">
                      <Play className="w-12 h-12 text-primary group-hover/vid:scale-110 transition-transform" />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Última Aula</p>
                      <p className="text-sm font-bold text-white line-clamp-2 leading-tight">{data.lastVideoWatched.title}</p>
                    </div>
                 </div>
               </Link>
             ) : (
               <Link href="/dashboard/videos" className="relative group/vid block cursor-pointer">
                 <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-3xl group-hover/vid:bg-primary/40 transition-all" />
                 <div className="relative w-full md:w-64 aspect-video md:aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center">
                    <Play className="w-12 h-12 text-primary group-hover/vid:scale-110 transition-transform" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Última Aula</p>
                      <p className="text-sm font-bold text-white line-clamp-2 leading-tight">Masterclass: Começar a Assistir</p>
                    </div>
                 </div>
               </Link>
             )}
          </motion.div>
        </div>
      </section>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/50 hover:bg-zinc-900 transition-all group relative overflow-hidden"
          >
            <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full -translate-y-1/2 translate-x-1/2", metric.bg)} />
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-white/5 transition-transform group-hover:scale-110", metric.bg, metric.color)}>
              <metric.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{metric.label}</p>
            <p className="text-3xl font-bold mt-2 tracking-tighter text-zinc-200">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Latest Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Conteúdos <span className="text-primary">Recentes</span></h2>
              <p className="text-xs text-zinc-500 font-medium">As últimas adições ao seu ecossistema.</p>
            </div>
            <Link href="/dashboard/prompts">
              <button className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest">
                Ver tudo <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.recentContent.map((item: any, idx: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <ContentCard 
                  id={item.id}
                  type={item.type}
                  title={item.title}
                  category={item.category?.name || "Geral"}
                  level={item.level || "Iniciante"}
                />
              </motion.div>
            ))}
            {data.recentContent.length === 0 && (
              <div className="py-20 text-center col-span-2 bg-zinc-950/50 border border-dashed border-white/5 rounded-[2.5rem]">
                <Layers className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-600 font-medium italic">O vault está sendo populado...</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Support */}
        <div className="space-y-8">
          <div className="px-2">
            <h2 className="text-2xl font-bold tracking-tight">Atalhos</h2>
            <p className="text-xs text-zinc-500 font-medium">Ações rápidas para sua produtividade.</p>
          </div>
          
          <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 space-y-4">
            <QuickAction icon={<Terminal className="w-5 h-5 text-purple-400" />} label="Gerar novo Prompt" href="/dashboard/prompts" />
            <QuickAction icon={<Video className="w-5 h-5 text-blue-400" />} label="Continuar assistindo" href={data.lastVideoWatched ? `/dashboard/videos/${data.lastVideoWatched.id}` : "/dashboard/videos"} />
            <QuickAction icon={<Layout className="w-5 h-5 text-emerald-400" />} label="Recursos de Design" href="/dashboard/templates" />
            
            <div className="mt-10 p-8 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group/support">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-2xl rounded-full" />
              <p className="text-[10px] font-bold text-primary mb-3 uppercase tracking-[0.2em]">SUPORTE ELITE</p>
              <p className="text-sm font-bold text-white mb-6 leading-relaxed">Alguma dúvida técnica? Nosso time está online para te ajudar.</p>
              <a 
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-primary hover:bg-accent text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-primary/10 active:scale-95 flex items-center justify-center"
              >
                ABRIR CHAMADO
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentCard({ id, type, title, category, level }: { id: string, type: string, title: string, category: string, level: string }) {
  const isVideo = type.toLowerCase().includes("víd") || type.toLowerCase() === "video" || type.toLowerCase().includes("vide");
  const isPrompt = type.toLowerCase().includes("prompt");
  const href = isVideo 
    ? `/dashboard/videos/${id}` 
    : isPrompt 
      ? `/dashboard/prompts?search=${encodeURIComponent(title)}` 
      : `/dashboard/templates?search=${encodeURIComponent(title)}`;
  
  return (
    <Link href={href} className="block">
      <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/30 hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          <ArrowUpRight className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <span className={cn(
            "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
            isVideo ? "bg-blue-500/10 text-blue-400" : isPrompt ? "bg-purple-500/10 text-purple-400" : "bg-emerald-500/10 text-emerald-400"
          )}>
            {type}
          </span>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 text-zinc-500 uppercase tracking-widest">
            {category}
          </span>
        </div>
        
        <h4 className="font-bold text-lg mb-6 line-clamp-2 leading-tight group-hover:text-primary transition-colors pr-8">
          {title}
        </h4>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-zinc-500">
             <Clock className="w-3.5 h-3.5" />
             <span className="text-[10px] font-bold uppercase tracking-widest">{level}</span>
          </div>
          <div className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-all">
            ACESSAR CONTEÚDO
          </div>
        </div>
      </div>
    </Link>
  );
}

function QuickAction({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href}>
      <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group text-left">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">{label}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-primary transition-all" />
      </button>
    </Link>
  );
}
