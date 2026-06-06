import { AdminSidebar } from "@/components/AdminSidebar";
import { Search, Bell, Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-zinc-100 font-[family-name:var(--font-geist-sans)]">
      <AdminSidebar />
      
      <main className="flex-1 flex flex-col">
        {/* Topbar Admin */}
        <header className="h-20 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-2 w-96 group focus-within:border-primary/50 transition-all">
            <Search className="w-4 h-4 text-zinc-600 group-focus-within:text-primary" />
            <input 
              type="text" 
              placeholder="Buscar registros, usuários ou logs..." 
              className="bg-transparent border-none outline-none text-sm w-full text-zinc-300 placeholder:text-zinc-600"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Sistema Online</span>
            </div>

            <div className="h-8 w-px bg-white/5" />

            <div className="flex items-center gap-4">
               <button className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-500 transition-all relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-black" />
               </button>
               
               <div className="flex items-center gap-3 pl-2">
                 <div className="text-right">
                   <p className="text-xs font-bold">Admin Master</p>
                   <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Acesso Root</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-zinc-500" />
                 </div>
               </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
