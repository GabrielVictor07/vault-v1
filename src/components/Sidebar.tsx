"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Terminal, 
  Video, 
  Layout, 
  Heart, 
  User, 
  Settings, 
  Shield,
  LogOut,
  Sparkles,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Terminal, label: "Prompts", href: "/dashboard/prompts" },
  { icon: Video, label: "Vídeos", href: "/dashboard/videos" },
  { icon: Layout, label: "Templates", href: "/dashboard/templates" },
  { icon: Heart, label: "Favoritos", href: "/dashboard/favorites" },
];

const secondaryItems = [
  { icon: User, label: "Perfil", href: "/dashboard/profile" },
  { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="w-72 border-r border-white/5 h-screen bg-black flex flex-col p-8 sticky top-0 z-50">
      <div className="flex items-center gap-3 mb-14 px-2 group cursor-pointer">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-black tracking-tighter text-xl leading-none">VAULT <span className="text-primary">1.0</span></span>
          <span className="text-[9px] font-bold text-zinc-600 tracking-[0.3em] mt-1 uppercase">Membros Elite</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em] mb-6 px-3">Navegação</p>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                pathname === item.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}>
                <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-primary" : "group-hover:text-primary transition-colors")} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                {pathname === item.href && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-10 space-y-1">
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em] mb-6 px-3">Preferências</p>
          {secondaryItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group",
                pathname === item.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}>
                <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-auto space-y-6">
        <div className="p-6 rounded-[2rem] bg-zinc-950 border border-white/5 relative overflow-hidden group/upgrade">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/upgrade:opacity-30 transition-all">
              <Zap className="w-8 h-8 text-primary" />
           </div>
           <p className="text-[9px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Plano Atual</p>
           <p className="text-sm font-bold text-white mb-4">ROOT ACCESS</p>
           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[85%]" />
           </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-600 hover:text-red-400 hover:bg-red-400/5 transition-all group font-bold text-xs"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          ENCERRAR SESSÃO
        </button>
      </div>
    </div>
  );
}
