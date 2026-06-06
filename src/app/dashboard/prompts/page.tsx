"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Terminal, 
  Copy, 
  Check, 
  Heart, 
  Layers,
  Palette,
  Layout,
  Zap,
  PenTool,
  Bot,
  Sparkles,
  X,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPrompts, getCategories, toggleFavoritePrompt, getFavoriteIds } from "@/app/actions/prompts";

function PromptsPageContent() {
  const searchParams = useSearchParams();
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const search = searchParams?.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [p, c, f] = await Promise.all([
        getPrompts(), 
        getCategories(),
        getFavoriteIds()
      ]);
      setPrompts(p);
      setDbCategories(c);
      setFavoriteIds(f);
      setLoading(false);
    };
    fetchData();
  }, []);

  const categories = [
    { id: "all", label: "Todos", icon: Layers },
    ...dbCategories.map(cat => ({
      id: cat.id,
      label: cat.name,
      icon: cat.name.toLowerCase().includes("design") ? Palette :
            cat.name.toLowerCase().includes("landing") ? Layout :
            cat.name.toLowerCase().includes("saas") ? Zap :
            cat.name.toLowerCase().includes("copy") ? PenTool :
            cat.name.toLowerCase().includes("auto") ? Bot : Terminal
    }))
  ];

  const filteredPrompts = prompts.filter(p => {
    const matchesCategory = selectedCategory === "all" || p.categoryId === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleFavorite = async (promptId: string) => {
    // Optimistic Update
    setFavoriteIds(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId) 
        : [...prev, promptId]
    );
    
    const res = await toggleFavoritePrompt(promptId);
    if (!res.success) {
      // Revert update in case of failure
      setFavoriteIds(prev => 
        prev.includes(promptId) 
          ? prev.filter(id => id !== promptId) 
          : [...prev, promptId]
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
        <p className="text-zinc-500 font-bold tracking-widest text-[10px] uppercase">Sincronizando prompts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="relative py-12 px-10 rounded-[3rem] bg-zinc-950 border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
              <Sparkles className="w-3 h-3" />
              Biblioteca Estratégica
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Engenharia de <span className="text-gradient">Prompts</span></h1>
            <p className="text-zinc-400 font-medium max-w-xl">Copie e cole comandos testados para obter resultados profissionais com IA em segundos.</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="O que você quer criar hoje?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>
      </header>

      {/* Categories Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border shadow-sm active:scale-95",
              selectedCategory === cat.id 
                ? "bg-primary border-primary text-white shadow-primary/20" 
                : "bg-zinc-950 border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
            )}
          >
            <cat.icon className={cn("w-4 h-4", selectedCategory === cat.id ? "text-white" : "text-zinc-600")} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredPrompts.map((prompt, idx) => (
            <motion.div
              key={prompt.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative flex flex-col p-8 rounded-[2.5rem] bg-zinc-950/50 border border-white/5 hover:border-primary/30 transition-all cursor-pointer overflow-hidden"
              onClick={() => setSelectedPrompt(prompt)}
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <Share2 className="w-5 h-5 text-zinc-600 hover:text-primary transition-colors" />
              </div>

              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-[0.2em] border border-primary/10">
                  {prompt.category?.name || "Geral"}
                </span>
                <div className="flex items-center gap-1.5 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    prompt.level === "Beginner" ? "bg-emerald-500" : prompt.level === "Intermediate" ? "bg-amber-500" : "bg-red-500"
                  )} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{prompt.level}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">{prompt.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-8 flex-1">
                {prompt.description}
              </p>

              <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(prompt.content, prompt.id);
                  }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-xs transition-all active:scale-95",
                    copiedId === prompt.id 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-white text-black hover:bg-zinc-200"
                  )}
                >
                  {copiedId === prompt.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      COPIADO
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      COPIAR PROMPT
                    </>
                  )}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(prompt.id);
                  }}
                  className={cn(
                    "p-3.5 rounded-xl border transition-all active:scale-90",
                    favoriteIds.includes(prompt.id)
                      ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
                      : "bg-white/5 border-white/10 text-zinc-500 hover:text-red-400 hover:bg-red-400/5"
                  )}
                >
                  <Heart className={cn("w-4 h-4", favoriteIds.includes(prompt.id) && "fill-current")} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPrompts.length === 0 && (
        <div className="py-20 text-center space-y-6 bg-zinc-950/30 border border-dashed border-white/5 rounded-[3rem]">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2">
            <Search className="w-10 h-10 text-zinc-800" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-300">Nenhum prompt encontrado</h3>
            <p className="text-zinc-600 font-medium">Tente buscar por termos diferentes ou selecione outra categoria.</p>
          </div>
          <button 
            onClick={() => {setSearchQuery(""); setSelectedCategory("all");}}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-400 hover:text-white transition-all"
          >
            LIMPAR FILTROS
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPrompt(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="p-10 md:p-14 space-y-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] bg-primary/10 px-3 py-1 rounded-full">{selectedPrompt.category?.name || "Geral"}</span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">{selectedPrompt.level}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{selectedPrompt.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleFavorite(selectedPrompt.id)}
                      className={cn(
                        "p-3 rounded-2xl border transition-all active:scale-90",
                        favoriteIds.includes(selectedPrompt.id)
                          ? "bg-red-500/10 border-red-500/20 text-red-500"
                          : "bg-white/5 border-white/10 text-zinc-500 hover:text-red-400"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", favoriteIds.includes(selectedPrompt.id) && "fill-current")} />
                    </button>
                    <button 
                      onClick={() => setSelectedPrompt(null)}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all active:scale-90"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Contexto Estratégico</h4>
                  <p className="text-zinc-400 leading-relaxed text-lg">{selectedPrompt.description}</p>
                </div>

                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Comando Pronto</h4>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] text-zinc-600 font-medium">Copie e cole na sua IA</span>
                    </div>
                  </div>
                  <div className="relative group/code">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur opacity-30 group-hover/code:opacity-60 transition duration-1000" />
                    <div className="relative p-8 rounded-3xl bg-black border border-white/10 font-mono text-sm text-zinc-300 leading-relaxed overflow-x-auto">
                       <pre className="whitespace-pre-wrap">{selectedPrompt.content}</pre>
                       <button 
                          onClick={() => copyToClipboard(selectedPrompt.content, selectedPrompt.id)}
                          className="absolute top-6 right-6 p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-primary hover:border-primary/30 transition-all opacity-0 group-hover/code:opacity-100"
                       >
                          <Copy className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center gap-5">
                     <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Zap className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Dica de Especialista</p>
                        <p className="text-xs text-zinc-400">Personalize os termos entre colchetes para resultados 10x melhores.</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => {
                      copyToClipboard(selectedPrompt.content, selectedPrompt.id);
                      setSelectedPrompt(null);
                    }}
                    className="bg-primary hover:bg-accent text-white font-bold py-6 rounded-[2rem] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl shadow-primary/20"
                  >
                    {copiedId === selectedPrompt.id ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                    {copiedId === selectedPrompt.id ? "PROMPT COPIADO!" : "COPIAR E FECHAR"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PromptsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
        <p className="text-zinc-500 font-bold tracking-widest text-[10px] uppercase">Preparando biblioteca...</p>
      </div>
    }>
      <PromptsPageContent />
    </Suspense>
  );
}
