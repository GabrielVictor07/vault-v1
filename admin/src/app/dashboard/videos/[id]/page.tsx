"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { getVideoById, updateVideo } from "@/app/actions/content";
import { getCategories, createCategory } from "@/app/actions/prompts";

export default function EditVideoPage() {
  const { id } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  
  // Estados para nova categoria
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);

  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [video, cats] = await Promise.all([
        getVideoById(id as string),
        getCategories()
      ]);
      
      if (!video) {
        setError("Vídeo não encontrado.");
      } else {
        setVideoData(video);
      }
      setCategories(cats);
    } catch (err) {
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setCreatingCat(true);
    const result = await createCategory(newCatName);
    if (result.success) {
      await fetchData();
      setNewCatName("");
      setShowNewCatInput(false);
    } else {
      alert(result.error);
    }
    setCreatingCat(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateVideo(id as string, formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/videos");
      }, 1500);
    } else {
      setError(result.error || "Ocorreu um erro ao atualizar o vídeo.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-zinc-500 text-sm font-medium">Carregando dados do vídeo...</p>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold tracking-tight">Editar <span className="text-primary">Vídeo</span></h1>
        <p className="text-zinc-500 mt-1">Atualize as informações da aula ou tutorial.</p>
      </header>

      {videoData && (
        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/30 border border-white/5 p-10 rounded-[2.5rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Título da Aula</label>
              <input 
                name="title"
                type="text"
                required
                defaultValue={videoData.title}
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
                    defaultValue={videoData.categoryId}
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
                defaultValue={videoData.module}
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
                defaultValue={videoData.duration}
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
                defaultValue={videoData.url}
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
              defaultValue={videoData.description}
              placeholder="O que o aluno aprenderá nesta aula?"
              className="w-full bg-black/50 border border-white/10 rounded-3xl px-6 py-5 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700 leading-relaxed"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button 
              type="submit"
              disabled={saving || success}
              className={cn(
                "flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-bold transition-all active:scale-95 shadow-xl",
                success ? "bg-emerald-500 text-white" : "bg-primary hover:bg-accent text-white shadow-primary/20"
              )}
            >
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : 
               success ? <><CheckCircle2 className="w-6 h-6" /> ALTERAÇÕES SALVAS!</> :
               <><Save className="w-6 h-6" /> SALVAR ALTERAÇÕES</>}
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
      )}
    </div>
  );
}
