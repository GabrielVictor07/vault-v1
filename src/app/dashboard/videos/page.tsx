"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Clock, 
  Search, 
  BookOpen, 
  Globe, 
  Rocket, 
  Code, 
  Brain, 
  Video as VideoIcon, 
  Sparkles, 
  Layers,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getVideos } from "@/app/actions/content";
import { getModuleProgresses, getLastActiveProgress } from "@/app/actions/progress";

export default function VideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<any[]>([]);
  const [moduleProgresses, setModuleProgresses] = useState<Record<string, number>>({});
  const [continueWatching, setContinueWatching] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [videosData, progressData, lastActive] = await Promise.all([
        getVideos(),
        getModuleProgresses(),
        getLastActiveProgress()
      ]);
      setVideos(videosData);
      setModuleProgresses(progressData);
      setContinueWatching(lastActive);
      setLoading(false);
    };
    loadData();
  }, []);

  // Agrupar vídeos por módulo
  const groupedModules = videos.reduce((acc: any, video: any) => {
    const modName = video.module || "Geral";
    if (!acc[modName]) {
      acc[modName] = {
        label: modName,
        count: 0,
        progress: moduleProgresses[modName] || 0,
        icon: modName.toLowerCase().includes("ia") ? Brain :
              modName.toLowerCase().includes("site") ? Globe :
              modName.toLowerCase().includes("lança") ? Rocket :
              modName.toLowerCase().includes("git") ? Code : BookOpen,
        videos: []
      };
    }
    acc[modName].videos.push(video);
    acc[modName].count++;
    return acc;
  }, {});

  const modulesList = Object.values(groupedModules) as any[];

  // Helper format seconds
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
        <p className="text-zinc-500 font-bold tracking-widest text-[10px] uppercase">Preparando videoaulas...</p>
      </div>
    );
  }

  // Define video to show in Continue Watching
  // If there's a real continue watching progress, use it. Otherwise, use first video of first module if available.
  const activeWatchingVideo = continueWatching?.video || (videos.length > 0 ? videos[0] : null);
  const activeWatchingModule = activeWatchingVideo?.module || "Geral";
  const activeWatchingProgress = continueWatching?.progress || 0;

  return (
    <div className="space-y-12 pb-20">
      <header className="relative py-12 px-10 rounded-[3rem] bg-zinc-950 border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
              <Sparkles className="w-3 h-3" />
              Treinamento Premium
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Cursos & <span className="text-gradient">Videoaulas</span></h1>
            <p className="text-zinc-400 font-medium max-w-xl">Aulas práticas direto ao ponto para você dominar as IAs e escalar sua produtividade.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
                 <p className="text-2xl font-bold text-white">{videos.length}</p>
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Aulas Totais</p>
             </div>
             <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
                 <p className="text-2xl font-bold text-white">{modulesList.length}</p>
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Módulos</p>
             </div>
          </div>
        </div>
      </header>

      {/* Continue Watching Section */}
      {activeWatchingVideo && (
        <section className="relative p-1 rounded-[2.5rem] bg-gradient-to-r from-primary/30 via-primary/5 to-blue-500/30">
          <div className="bg-zinc-950/90 backdrop-blur-xl p-8 md:p-10 rounded-[2.4rem] flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex flex-col md:flex-row items-center gap-10 flex-1">
               <div 
                 onClick={() => router.push(`/dashboard/videos/${activeWatchingVideo.id}`)}
                 className="relative w-full md:w-64 aspect-video rounded-3xl overflow-hidden border border-white/10 group cursor-pointer shadow-2xl shrink-0"
               >
                  {activeWatchingVideo.thumbnail ? (
                    <img 
                      src={activeWatchingVideo.thumbnail} 
                      alt={activeWatchingVideo.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-900" />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                     <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all">
                        <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
                     </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                     <div className="h-full bg-primary transition-all duration-300" style={{ width: `${activeWatchingProgress || 10}%` }} />
                  </div>
               </div>
               
               <div className="space-y-4 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                     <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                     <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                       {continueWatching ? "Continuar Assistindo" : "Começar a Assistir"}
                     </p>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{activeWatchingVideo.title}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-zinc-500 font-medium">
                     <span className="flex items-center gap-2">
                       <Clock className="w-4 h-4" /> 
                       {activeWatchingVideo.duration ? formatDuration(activeWatchingVideo.duration) : "Vídeo"}
                     </span>
                     <span className="flex items-center gap-2">
                       <Layers className="w-4 h-4" /> 
                       Módulo: {activeWatchingModule}
                     </span>
                  </div>
               </div>
            </div>
            
            <button 
              onClick={() => router.push(`/dashboard/videos/${activeWatchingVideo.id}`)}
              className="w-full md:w-auto px-10 py-5 bg-white text-black rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 shrink-0"
            >
               {continueWatching ? "RESUMIR AULA" : "INICIAR AULA"}
            </button>
          </div>
        </section>
      )}

      {/* Modules Grid */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold tracking-tight px-4">Seus <span className="text-primary">Módulos</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {modulesList.map((module: any, index) => (
            <motion.div
              key={module.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/dashboard/videos/${module.videos[0].id}`)}
              className="group relative flex flex-col justify-between p-8 rounded-[3rem] bg-zinc-950/40 border border-white/5 hover:border-primary/30 transition-all cursor-pointer overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-primary transition-colors">
                    <module.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="px-4 py-2 rounded-2xl bg-black/50 border border-white/5 text-[10px] font-bold text-white tracking-widest">
                    {module.count} AULAS
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors leading-snug">{module.label}</h3>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-1">Explore as melhores técnicas de {module.label.toLowerCase()} com IA.</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 mb-6">
                   <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Progresso</span>
                      <span className="text-primary">{module.progress}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${module.progress}%` }}
                        className="h-full bg-primary transition-all duration-500"
                      />
                   </div>
                </div>
              </div>

              {/* Video List inside module card */}
              <div className="pt-6 border-t border-white/5 space-y-3">
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Aulas Principais</p>
                {module.videos.slice(0, 3).map((v: any) => (
                  <div 
                    key={v.id} 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/videos/${v.id}`);
                    }}
                    className="flex items-center justify-between text-xs text-zinc-500 hover:text-primary transition-colors cursor-pointer group/lesson"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Play className="w-3 h-3 text-zinc-700 group-hover/lesson:text-primary fill-current transition-colors" />
                      <span className="truncate">{v.title}</span>
                    </div>
                    <span className="text-[10px] text-zinc-600 shrink-0 font-medium">
                      {v.duration ? formatDuration(v.duration) : "AULA"}
                    </span>
                  </div>
                ))}
                {module.videos.length > 3 && (
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pt-1 flex items-center gap-1.5">
                    <span>+ {module.videos.length - 3} mais aulas</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {videos.length === 0 && (
        <div className="py-20 text-center space-y-6 bg-zinc-950/30 border border-dashed border-white/5 rounded-[3rem]">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2">
            <VideoIcon className="w-10 h-10 text-zinc-800" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-300">Nenhuma aula disponível</h3>
            <p className="text-zinc-600 font-medium">Novos conteúdos estão sendo preparados pelo time do Vault.</p>
          </div>
        </div>
      )}
    </div>
  );
}
