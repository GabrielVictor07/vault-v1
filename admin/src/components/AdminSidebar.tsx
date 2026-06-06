"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Terminal, 
  Video, 
  Layout, 
  Users, 
  Settings, 
  ShieldCheck,
  LogOut,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Estatísticas", href: "/dashboard" },
  { icon: Terminal, label: "Gerenciar Prompts", href: "/dashboard/prompts" },
  { icon: Video, label: "Gerenciar Vídeos", href: "/dashboard/videos" },
  { icon: Layout, label: "Gerenciar Templates", href: "/dashboard/templates" },
  { icon: Users, label: "Usuários", href: "/dashboard/users" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/vault-master-auth");
  };

  return (
    <div className="w-72 border-r border-white/5 h-screen bg-zinc-950 flex flex-col p-8 sticky top-0">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
           <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-lg leading-none">VAULT <span className="text-primary">MASTER</span></span>
          <span className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] mt-1 uppercase">Admin Control</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6 px-2">Gestão de Conteúdo</p>
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group relative",
              pathname === item.href ? "bg-white/5 text-primary border border-white/10" : "text-zinc-500 hover:text-white hover:bg-white/5"
            )}>
              <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-primary" : "text-zinc-600 group-hover:text-zinc-400")} />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
              {pathname === item.href && (
                <motion.div 
                  layoutId="active-nav-admin"
                  className="absolute -left-2 w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"
                />
              )}
            </div>
          </Link>
        ))}

        <div className="pt-10 space-y-2">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6 px-2">Sistema</p>
          <Link href="/dashboard/settings">
            <div className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group relative",
              pathname === "/dashboard/settings" ? "bg-white/5 text-primary border border-white/10" : "text-zinc-500 hover:text-white hover:bg-white/5"
            )}>
              <Settings className={cn("w-5 h-5", pathname === "/dashboard/settings" ? "text-primary" : "text-zinc-600 group-hover:text-zinc-400")} />
              <span className="text-sm font-bold tracking-tight">Configurações</span>
              {pathname === "/dashboard/settings" && (
                <motion.div 
                  layoutId="active-nav-admin"
                  className="absolute -left-2 w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(255,45,141,0.8)]"
                />
              )}
            </div>
          </Link>
          <div className="flex items-center gap-4 px-4 py-3 rounded-2xl text-zinc-500 opacity-50 cursor-not-allowed">
             <Database className="w-5 h-5" />
             <span className="text-sm font-bold tracking-tight">Logs do Banco</span>
          </div>
        </div>
      </nav>

      <button 
        onClick={handleSignOut}
        className="flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition-all mt-auto border border-transparent hover:border-red-500/10"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-bold">Encerrar Sessão</span>
      </button>
    </div>
  );
}
