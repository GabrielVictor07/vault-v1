"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  Video, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  X,
  PlayCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createVideo } from "@/app/actions/content";
import { getCategories, createCategory } from "@/app/actions/prompts";

export default function NewVideoPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Estados para nova categoria
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);

  const router = useRouter();

  const fetchCategories = async () => {
    const cats = await getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setCreatingCat(true);
    const result = await createCategory(newCatName);
    if (result.success) {
      await fetchCategories();
      setNewCatName("");
      setShowNewCatInput(false);
    } else {
      alert(result.error);
    }
    setCreatingCat(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createVideo(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/videos");
      }, 1500);
    } else {
      setError(result.error || "Ocorreu um erro ao salvar o vídeo.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link 
        href="/dashboard/videos" 
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-sm font-medium group w-fit"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar para a lista
      </Link>

      <header>
        <h1 className="text-3xl font-bold tracking-tight">Novo <span className="text-primary">Vídeo</span></h1>
        <p className="text-zinc-500 mt-1">Adicione uma nova aula ou tutorial à plataforma Vault.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/30 border border-white/5 p-10 rounded-[2.5rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Título da Aula</label>
            <input 
              name="title"
              type="text"
              required
              placeholder="Ex: Dominando o Midjourney 6.0"
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Categoria</label>
              <button 
                type="button" 
                onClick={() => setShowNewCatInput(!showNewCatInput)}
                className="text-[10px] font-bold text-primary hover:text-accent transition-colors flex items-center gap-1"
              >
                {showNewCatInput ? <><X className="w-3 h-3" /> CANCELAR</> : <><Plus className="w-3 h-3" /> NOVA CATEGORIA</>}
              </button>
            </div>
            
            <AnimatePresence mode="wait">
              {showNewCatInput ? (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-2"
                >
                  <input 
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nome da categoria..."
                    className="flex-1 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={creatingCat}
                    className="bg-primary text-white px-4 rounded-2xl hover:bg-accent transition-all disabled:opacity-50"
                  >
                    {creatingCat ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  </button>
                </motion.div>
              ) : (
                <motion.select 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  name="categoryId"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </motion.select>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Módulo</label>
            <input 
              name="module"
              type="text"
              required
              placeholder="Ex: Introdução à IA"
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Duração (segundos)</label>
            <input 
              name="duration"
              type="number"
              required
              placeholder="Ex: 600"
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">URL do Vídeo (Vimeo/YouTube/S3)</label>
          <div className="relative">
            <PlayCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
            <input 
              name="url"
              type="url"
              required
              placeholder="https://..."
              className="w-full bg-black/50 border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Descrição</label>
          <textarea 
            name="description"
            required
            rows={4}
            placeholder="O que o aluno aprenderá nesta aula?"
            className="w-full bg-black/50 border border-white/10 rounded-3xl px-6 py-5 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700 leading-relaxed"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <button 
            type="submit"
            disabled={loading || success}
            className={cn(
              "flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-bold transition-all active:scale-95 shadow-xl",
              success ? "bg-emerald-500 text-white" : "bg-primary hover:bg-accent text-white shadow-primary/20"
            )}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 
             success ? <><CheckCircle2 className="w-6 h-6" /> VÍDEO SALVO!</> :
             <><Save className="w-6 h-6" /> PUBLICAR VÍDEO</>}
          </button>
          
          <Link href="/dashboard/videos" className="flex-1">
            <button type="button" className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all text-zinc-400">
              CANCELAR
            </button>
          </Link>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}
      </form>
    </div>
  );
}
