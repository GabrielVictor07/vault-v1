"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Terminal, 
  Layout, 
  ArrowRight,
  Trash2,
  ExternalLink,
  Palette,
  Zap,
  PenTool,
  Bot
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getUserFavorites, toggleFavoritePrompt } from "@/app/actions/prompts";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserFavorites().then(data => {
      setFavorites(data);
      setLoading(false);
    });
  }, []);

  const removeFavorite = async (id: string) => {
    // Optimistic Update
    setFavorites(prev => prev.filter(f => f.id !== id));
    await toggleFavoritePrompt(id);
  };

  const getIcon = (categoryName: string) => {
    const name = categoryName?.toLowerCase() || "";
    if (name.includes("design")) return Palette;
    if (name.includes("landing")) return Layout;
    if (name.includes("saas")) return Zap;
    if (name.includes("copy")) return PenTool;
    if (name.includes("auto")) return Bot;
    return Terminal;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
        <p className="text-zinc-500 font-bold tracking-widest text-[10px] uppercase">Carregando seus favoritos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Seus <span className="text-primary">Favoritos</span></h1>
        <p className="text-zinc-400 mt-1">Tudo o que você salvou para acessar mais tarde.</p>
      </header>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {favorites.map((item) => {
              const Icon = getIcon(item.category?.name);
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="group p-6 rounded-3xl border border-white/5 bg-zinc-950/40 hover:border-primary/20 transition-all flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-6 z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-zinc-400 group-hover:text-primary transition-colors" />
                    </div>
                    <button 
                      onClick={() => removeFavorite(item.id)}
                      className="p-2 rounded-xl hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all z-20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 mb-8 flex-1 z-10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">PROMPT</p>
                    <h3 className="text-lg font-bold line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-zinc-500">{item.category?.name || "Geral"}</p>
                  </div>

                  <Link href="/dashboard/prompts" className="w-full z-10">
                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold transition-all">
                      ACESSAR CONTEÚDO
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
            <Heart className="w-10 h-10 text-zinc-700" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Nenhum favorito ainda</h3>
            <p className="text-zinc-500 max-w-xs mx-auto">Comece a explorar nossa biblioteca e salve o que for mais útil para você.</p>
          </div>
          <Link href="/dashboard/prompts">
            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary hover:bg-accent text-white font-bold text-sm transition-all shadow-lg shadow-primary/20">
              EXPLORAR BIBLIOTECA
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
