"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  ExternalLink, 
  Tag, 
  Search, 
  Layout, 
  Smartphone, 
  CreditCard, 
  Stethoscope, 
  Home as HomeIcon,
  Briefcase,
  Sparkles,
  FileCode,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getTemplates } from "@/app/actions/content";

function TemplatesPageContent() {
  const searchParams = useSearchParams();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const search = searchParams?.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  useEffect(() => {
    getTemplates().then(data => {
      setTemplates(data);
      setLoading(false);
    });
  }, []);

  const getIcon = (categoryName: string) => {
    const name = categoryName?.toLowerCase() || "";
    if (name.includes("saas") || name.includes("site")) return Layout;
    if (name.includes("mobile")) return Smartphone;
    if (name.includes("finance")) return CreditCard;
    if (name.includes("saúde") || name.includes("médico")) return Stethoscope;
    if (name.includes("imobi")) return HomeIcon;
    return Briefcase;
  };

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
        <p className="text-zinc-500 font-bold tracking-widest text-[10px] uppercase">Carregando recursos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="relative py-12 px-10 rounded-[3rem] bg-zinc-950 border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
              <Sparkles className="w-3 h-3" />
              Recursos de Design
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Kits & <span className="text-gradient">Templates</span></h1>
            <p className="text-zinc-400 font-medium max-w-xl">Acelere seus projetos com arquivos editáveis de UI/UX, código-fonte e ferramentas prontas.</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar por ferramenta..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template, index) => {
            const Icon = getIcon(template.category?.name);
            const tags = template.tags || [];
            
            return (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex flex-col p-8 rounded-[3rem] border border-white/5 bg-zinc-950/40 hover:border-primary/30 transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                
                <div className="relative z-10 space-y-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-all group-hover:scale-110 shadow-2xl">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 text-zinc-500 uppercase tracking-widest border border-white/5">
                      {template.category?.name || "Geral"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold group-hover:text-white transition-colors tracking-tight">{template.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">
                      {template.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string) => (
                      <span key={tag} className="flex items-center gap-1 text-[9px] font-bold text-zinc-600 bg-white/[0.02] px-2 py-1 rounded-lg border border-white/5">
                        <Tag className="w-2.5 h-2.5 opacity-30" />
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-6 mt-auto">
                    <a 
                      href={template.downloadUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-white text-black py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 text-center shadow-lg shadow-white/5"
                    >
                      <Download className="w-4 h-4" />
                      DOWNLOAD
                    </a>
                    {template.previewUrl && (
                      <a 
                        href={template.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-500 hover:text-white transition-all active:scale-95"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="py-20 text-center space-y-6 bg-zinc-950/30 border border-dashed border-white/5 rounded-[3rem]">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2">
            <Layers className="w-10 h-10 text-zinc-800" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-300">Nenhum recurso encontrado</h3>
            <p className="text-zinc-600 font-medium">Tente ajustar sua busca ou aguarde novas ferramentas.</p>
          </div>
        </div>
      )}

      {/* Premium CTA Section */}
      <section className="relative p-12 md:p-20 rounded-[4rem] bg-zinc-950 border border-white/5 overflow-hidden text-center space-y-8 group">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[100px] opacity-50" />
         <div className="relative z-10 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Sentiu falta de algo?</h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-lg font-medium">Nosso time de designers e desenvolvedores atualiza o Vault semanalmente. Envie sua sugestão.</p>
         </div>
         <div className="relative z-10 pt-4">
            <button className="px-10 py-5 bg-primary hover:bg-accent text-white rounded-[2rem] font-bold text-sm transition-all shadow-2xl shadow-primary/20 active:scale-95 flex items-center gap-3 mx-auto">
               SUGERIR NOVO TEMPLATE <ArrowUpRight className="w-5 h-5" />
            </button>
         </div>
      </section>
    </div>
  );
}

export default function TemplatesPage() {
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
      <TemplatesPageContent />
    </Suspense>
  );
}
