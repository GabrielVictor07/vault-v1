"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users as UsersIcon, 
  Search, 
  Mail, 
  Shield, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  Edit3,
  UserPlus,
  Loader2,
  X,
  Save,
  Ban
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsers, updateUserPlan, updateUserStatus } from "@/app/actions/users";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const plan = formData.get("plan") as string;
    const status = formData.get("status") as string;

    try {
      await Promise.all([
        updateUserPlan(editingUser.id, plan),
        updateUserStatus(editingUser.id, status)
      ]);
      await fetchUsers();
      setEditingUser(null);
    } catch (error) {
      alert("Erro ao atualizar usuário");
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de <span className="text-primary">Usuários</span></h1>
          <p className="text-zinc-500 mt-1">Monitore quem está acessando o Vault e gerencie permissões manuais.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm transition-all hover:bg-zinc-200">
          <UserPlus className="w-5 h-5" />
          CONVIDAR USUÁRIO
        </button>
      </div>

      <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4 bg-black/50 border border-white/5 rounded-2xl px-4 py-2 flex-1 max-w-md">
             <Search className="w-4 h-4 text-zinc-600" />
             <input 
               type="text" 
               placeholder="Buscar por nome ou e-mail..." 
               className="bg-transparent border-none outline-none text-sm w-full" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-zinc-500 text-sm font-medium">Carregando membros...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Usuário</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Acesso</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Data de Cadastro</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                          <UsersIcon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-zinc-200">{user.name || "Sem Nome"}</span>
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        user.plan === "FULL" ? "bg-primary/10 text-primary border-primary/20" : 
                        user.plan === "ROOT" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : 
                        "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                      )}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center text-xs text-zinc-500">
                      <div className="flex items-center justify-center gap-2">
                         <Calendar className="w-3.5 h-3.5" />
                         {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        user.status !== "BANNED" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                      )}>
                        {user.status !== "BANNED" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {user.status || "ACTIVE"}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => setEditingUser(user)}
                           className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
                         >
                            <Edit3 className="w-4 h-4" />
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
                <UsersIcon className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold">Nenhum usuário encontrado</h3>
              <p className="text-zinc-500">Tente ajustar sua busca ou aguarde novos membros.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Editar Usuário</h2>
                  <p className="text-xs text-zinc-500">{editingUser.email}</p>
                </div>
                <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Plano de Acesso</label>
                  <select 
                    name="plan"
                    defaultValue={editingUser.plan}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="free">FREE</option>
                    <option value="FULL">FULL</option>
                    <option value="ROOT">ROOT (Admin)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Status da Conta</label>
                  <select 
                    name="status"
                    defaultValue={editingUser.status || "ACTIVE"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="ACTIVE">ATIVO</option>
                    <option value="BANNED">BANIDO</option>
                    <option value="PENDING">PENDENTE</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary hover:bg-accent text-white font-bold transition-all shadow-lg shadow-primary/20"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> SALVAR</>}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-bold hover:bg-white/10 transition-all"
                  >
                    CANCELAR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
