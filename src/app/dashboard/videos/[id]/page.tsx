"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Play, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Share2,
  MessageSquare,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getVideoPlayerDetails, toggleVideoCompleted } from "@/app/actions/progress";

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [videoData, setVideoData] = useState<any | null>(null);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getVideoPlayerDetails(id).then(res => {
      if (res) {
        setVideoData(res.video);
        setPlaylist(res.playlist);
        setCompleted(res.userProgress?.completed || false);
      }
      setLoading(false);
    });
  }, [id]);

  const handleToggleCompleted = async () => {
    if (!videoData) return;
    const res = await toggleVideoCompleted(videoData.id);
    if (res.success) {
      setCompleted(res.completed || false);
      // Atualizar a playlist localmente para refletir o status
      setPlaylist(prev => prev.map(v => v.id === videoData.id ? { ...v, completed: res.completed } : v));
    }
  };

  const handlePlayVideo = () => {
    // Aqui poderíamos ter lógica extra de player de vídeo
    console.log("Iniciando player do vídeo", videoData?.title);
  };

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
        <p className="text-zinc-500 font-bold tracking-widest text-[10px] uppercase">Carregando aula...</p>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="text-center py-20 space-y-6">
        <h3 className="text-2xl font-bold">Aula não encontrada</h3>
        <p className="text-zinc-500">O vídeo solicitado não está disponível ou foi removido.</p>
        <Link href="/dashboard/videos">
          <button className="px-6 py-3 bg-primary rounded-xl font-bold text-xs">VOLTAR PARA A BIBLIOTECA</button>
        </Link>
      </div>
    );
  }

  const completedCount = playlist.filter(v => v.completed).length;

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-20">
      {/* Left side: Player & Content */}
      <div className="flex-1 space-y-6">
        <Link 
          href="/dashboard/videos" 
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-sm font-medium mb-4 group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para biblioteca
        </Link>

        {/* Player Container */}
        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black border border-white/5 group shadow-2xl">
          {videoData.thumbnail ? (
            <img 
              src={videoData.thumbnail} 
              alt={videoData.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 to-zinc-900" />
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all">
             <button 
               onClick={handlePlayVideo}
               className="w-20 h-20 bg-primary hover:bg-accent text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 cursor-pointer hover:scale-110 active:scale-95 transition-all border border-white/10"
             >
                <Play className="w-8 h-8 text-white fill-current ml-1" />
             </button>
          </div>

          {/* Progress Bar at bottom of player */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
            <div className={cn("h-full bg-primary transition-all duration-500", completed ? "w-full" : "w-1/3")} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Módulo: {videoData.module || "Geral"}</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{videoData.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {videoData.url && (
              <a 
                href={videoData.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                ACESSAR LINK
              </a>
            )}
            <button 
              onClick={handleToggleCompleted}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 border",
                completed 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" 
                  : "bg-primary border-primary text-white hover:bg-accent shadow-lg shadow-primary/20"
              )}
            >
              {completed ? "CONCLUÍDA ✅" : "MARCAR COMO CONCLUÍDA"}
              {!completed && <CheckCircle2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-zinc-950/40 border border-white/5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Sobre esta aula</h3>
          <p className="text-zinc-400 leading-relaxed">
            {videoData.description || "Nenhuma descrição adicional foi fornecida para esta aula. Assista ao conteúdo completo no player acima."}
          </p>
        </div>
      </div>

      {/* Right side: Playlist */}
      <div className="w-full xl:w-96 space-y-6">
        <div className="p-6 rounded-[2rem] border border-white/5 bg-zinc-950/40 sticky top-24">
          <h3 className="font-bold mb-6 flex items-center justify-between text-white">
            Aulas do Módulo
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              {completedCount}/{playlist.length} Aulas
            </span>
          </h3>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
            {playlist.map((video) => (
              <div 
                key={video.id}
                onClick={() => router.push(`/dashboard/videos/${video.id}`)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer group border",
                  video.active 
                    ? "bg-primary/10 border-primary/20" 
                    : "bg-transparent border-transparent hover:bg-white/5"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all border",
                  video.completed 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : video.active 
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-white/5 border-white/10 text-zinc-600 group-hover:text-zinc-400"
                )}>
                  {video.completed ? <CheckCircle2 className="w-5 h-5" /> : <Play className="w-4 h-4 fill-current" />}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <h4 className={cn(
                    "text-xs font-bold truncate transition-colors",
                    video.active ? "text-primary" : "text-zinc-400 group-hover:text-white"
                  )}>
                    {video.title}
                  </h4>
                  <p className="text-[10px] text-zinc-600 font-medium">
                    {video.duration ? formatDuration(video.duration) : "Vídeo"}
                  </p>
                </div>

                {video.active && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary" />}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center">
             <MessageSquare className="w-5 h-5 text-zinc-600 mx-auto mb-2" />
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Dúvidas?</p>
             <button className="text-xs font-bold text-primary hover:underline mt-1">Acessar Comunidade</button>
          </div>
        </div>
      </div>
    </div>
  );
}
