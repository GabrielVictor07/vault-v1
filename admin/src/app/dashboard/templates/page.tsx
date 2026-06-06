"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Layout, 
  Search, 
  Download, 
  FileCode, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Tag,
  Eye,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getTemplates, deleteTemplate } from "@/app/actions/content";

export default function ManageTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTemplates = async () => {
    setLoading(true);
    const data = await getTemplates();
    setTemplates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este template?")) return;
    setDeletingId(id);
    const result = await deleteTemplate(id);
    if (result.success) {
      fetchTemplates();
    } else {
      alert(result.error);
    }
    setDeletingId(null);
  };

  const filteredTemplates = templates.filter(template => 
    template.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar <span className="text-primary">Templates</span></h1>
          <p className="text-zinc-500 mt-1">Gerencie os arquivos e ferramentas disponíveis para os membros.</p>
        </div>
        <Link href="/dashboard/templates/new">
          <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-accent text-white font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            SUBIR TEMPLATE
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5 flex items-center gap-4 hover:border-primary/20 transition-all cursor-default group">
           <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <FileCode className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Arquivos Ativos</p>
              <p className="text-xl font-bold">{filteredTemplates.length}</p>
           </div>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4 bg-black/50 border border-white/5 rounded-2xl px-4 py-2 flex-1 max-w-md group focus-within:border-primary/50 transition-all">
             <Search className="w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
             <input 
               type="text" 
               placeholder="Buscar templates..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent border-none outline-none text-sm w-full text-zinc-300 placeholder:text-zinc-600" 
             />
           </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-zinc-500 text-sm font-medium">Carregando templates...</p>
            </div>
          ) : filteredTemplates.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Template</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Categoria</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Tags</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-primary group-hover:border-primary/20 transition-all">
                          <Layout className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-zinc-200">{template.title}</span>
                          <span className="text-[10px] text-zinc-500 truncate max-w-[200px]">{template.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {template.category?.name || "Sem Categoria"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {template.tags?.map((tag: string) => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Link href={`/dashboard/templates/${template.id}`}>
                           <button className="p-2.5 rounded-xl hover:bg-primary/10 text-zinc-500 hover:text-primary transition-all">
                              <Edit3 className="w-4 h-4" />
                           </button>
                         </Link>
                         <button 
                           onClick={() => handleDelete(template.id)}
                           disabled={deletingId === template.id}
                           className="p-2.5 rounded-xl hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all"
                         >
                            {deletingId === template.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                         </button>
                         <a href={template.downloadUrl} target="_blank" className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all">
                            <ExternalLink className="w-4 h-4" />
                         </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Layout className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold">Nenhum template disponível</h3>
              <p className="text-zinc-500">Suba arquivos de design ou ferramentas para os membros.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
