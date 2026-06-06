"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Terminal,
  Zap,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getPrompts, deletePrompt } from "@/app/actions/prompts";

export default function ManagePromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPrompts = async () => {
    setLoading(true);
    const data = await getPrompts();
    setPrompts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este prompt?")) return;
    
    setDeletingId(id);
    const result = await deletePrompt(id);
    if (result.success) {
      fetchPrompts();
    } else {
      alert(result.error);
    }
    setDeletingId(null);
  };

  const filteredPrompts = prompts.filter(prompt => 
    prompt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar <span className="text-primary">Prompts</span></h1>
          <p className="text-zinc-500 mt-1">Adicione, edite ou remova prompts da biblioteca oficial.</p>
        </div>
        <Link href="/dashboard/prompts/new">
          <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-accent text-white font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            NOVO PROMPT
          </button>
        </Link>
      </div>

      <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden">
        {/* Table Header / Filters */}
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 bg-black/50 border border-white/5 rounded-2xl px-4 py-2 flex-1 max-w-md group focus-within:border-primary/50 transition-all">
            <Search className="w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filtrar prompts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-zinc-300 placeholder:text-zinc-600" 
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 rounded-xl border border-white/5 hover:bg-white/5 text-zinc-500 transition-all">
                <Filter className="w-5 h-5" />
             </button>
             <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest px-2">Total: {filteredPrompts.length}</span>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-zinc-500 text-sm font-medium">Carregando prompts...</p>
            </div>
          ) : filteredPrompts.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Prompt</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Categoria</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPrompts.map((prompt) => (
                  <tr key={prompt.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                          <Terminal className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-zinc-200">{prompt.title}</span>
                          <span className="text-[10px] text-zinc-500">{prompt.level}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {prompt.category?.name || "Sem Categoria"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Link href={`/dashboard/prompts/${prompt.id}`}>
                           <button className="p-2.5 rounded-xl hover:bg-primary/10 text-zinc-500 hover:text-primary transition-all">
                              <Edit3 className="w-4 h-4" />
                           </button>
                         </Link>
                         <button 
                           onClick={() => handleDelete(prompt.id)}
                           disabled={deletingId === prompt.id}
                           className="p-2.5 rounded-xl hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all disabled:opacity-50"
                         >
                            {deletingId === prompt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                         </button>
                         <button className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all">
                            <MoreVertical className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold">Nenhum prompt no banco</h3>
              <p className="text-zinc-500">Comece adicionando seu primeiro prompt estratégico.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
