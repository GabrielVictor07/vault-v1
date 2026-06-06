"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Video as VideoIcon, 
  Play, 
  Layers, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ChevronRight,
  Clock,
  Eye,
  Loader2,
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getVideos, deleteVideo } from "@/app/actions/content";

export default function ManageVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVideos = async () => {
    setLoading(true);
    const data = await getVideos();
    setVideos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este vídeo?")) return;
    setDeletingId(id);
    const result = await deleteVideo(id);
    if (result.success) {
      fetchVideos();
    } else {
      alert(result.error);
    }
    setDeletingId(null);
  };

  const toggleModule = (modName: string) => {
    setExpandedModules(prev => 
      prev.includes(modName) 
        ? prev.filter(m => m !== modName) 
        : [...prev, modName]
    );
  };

  const filteredVideos = videos.filter(video => 
    video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.module?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-expandir módulos quando houver busca ativa
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const activeModules = filteredVideos.map(v => v.module || "Sem Módulo");
      setExpandedModules(Array.from(new Set(activeModules)));
    }
  }, [searchQuery, videos]);

  // Agrupar vídeos por módulo
  const modules = filteredVideos.reduce((acc: any, video: any) => {
    const modName = video.module || "Sem Módulo";
    if (!acc[modName]) acc[modName] = [];
    acc[modName].push(video);
    return acc;
  }, {});

  const moduleNames = Object.keys(modules);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar <span className="text-primary">Vídeos</span></h1>
          <p className="text-zinc-500 mt-1">Organize suas aulas e gerencie o conteúdo de vídeo do Vault.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/videos/new">
            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-accent text-white font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="w-5 h-5" />
              ADICIONAR VÍDEO
            </button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-zinc-900/30 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-4 bg-black/50 border border-white/5 rounded-2xl px-4 py-2 flex-1 max-w-md group focus-within:border-primary/50 transition-all">
           <Search className="w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
           <input 
             type="text" 
             placeholder="Buscar aulas, módulos ou categorias..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="bg-transparent border-none outline-none text-sm w-full text-zinc-300 placeholder:text-zinc-600" 
           />
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-zinc-500 text-sm font-medium">Carregando conteúdo...</p>
          </div>
        ) : moduleNames.length > 0 ? (
          moduleNames.map((modName) => (
            <div key={modName} className="space-y-4">
              <button 
                onClick={() => toggleModule(modName)}
                className="w-full flex items-center justify-between p-6 bg-zinc-900/30 border border-white/5 rounded-3xl hover:border-primary/20 transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold">{modName}</h3>
                    <p className="text-xs text-zinc-500 font-medium">{modules[modName].length} vídeos</p>
                  </div>
                </div>
                {expandedModules.includes(modName) ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
              </button>

              <AnimatePresence>
                {expandedModules.includes(modName) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-3 pl-6"
                  >
                    {modules[modName].map((video: any) => (
                      <div 
                        key={video.id}
                        className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                            <Play className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-200">{video.title}</p>
                            <p className="text-[10px] text-zinc-500">{video.duration} min • {video.category?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/videos/${video.id}`}>
                            <button className="p-2 rounded-lg hover:bg-primary/10 text-zinc-600 hover:text-primary transition-all">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(video.id)}
                            disabled={deletingId === video.id}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all"
                          >
                            {deletingId === video.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <VideoIcon className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold">Nenhum vídeo encontrado</h3>
            <p className="text-zinc-500">Comece populando sua plataforma com aulas estratégicas.</p>
          </div>
        )}
      </div>

      {/* Quick Stats bar */}
      <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 flex flex-wrap gap-12 items-center justify-center text-center">
         <div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">Total de Vídeos</p>
            <p className="text-2xl font-bold text-zinc-200">{videos.length}</p>
         </div>
         <div className="w-px h-8 bg-white/5 hidden md:block" />
         <div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">Módulos</p>
            <p className="text-2xl font-bold text-zinc-200">{moduleNames.length}</p>
         </div>
      </div>
    </div>
  );
}
