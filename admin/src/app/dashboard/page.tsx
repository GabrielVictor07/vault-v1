"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDashboardMetrics, getRecentActivity } from "@/app/actions/content";
import { useState, useEffect } from "react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    userCount: 0,
    promptCount: 0,
    videoCount: 0,
    templateCount: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardMetrics(),
      getRecentActivity()
    ]).then(([m, a]) => {
      setMetrics(m);
      setActivities(a);
      setLoading(false);
    });
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Agora mesmo";
    if (diffInSeconds < 3600) return `Há ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Há ${Math.floor(diffInSeconds / 3600)} horas`;
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Painel de <span className="text-primary">Controle</span></h1>
        <p className="text-zinc-500 mt-1">Visão geral da saúde do seu ecossistema Vault.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total de Usuários" 
          value={metrics.userCount.toLocaleString()} 
          change="+12% este mês" 
          trend="up" 
          icon={<Users className="w-5 h-5" />} 
        />
        <StatCard 
          label="Vídeos Disponíveis" 
          value={metrics.videoCount.toLocaleString()} 
          change="+8% este mês" 
          trend="up" 
          icon={<DollarSign className="w-5 h-5" />} 
        />
        <StatCard 
          label="Prompts Ativos" 
          value={metrics.promptCount.toLocaleString()} 
          change="+45 novos" 
          trend="up" 
          icon={<Zap className="w-5 h-5" />} 
        />
        <StatCard 
          label="Templates" 
          value={metrics.templateCount.toLocaleString()} 
          change="-0.4% hoje" 
          trend="down" 
          icon={<TrendingUp className="w-5 h-5" />} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="xl:col-span-2 space-y-6">
          <h3 className="text-lg font-bold px-2">Atividades Recentes</h3>
          <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden min-h-[400px]">
             <div className="p-6 border-b border-white/5 bg-white/5">
                <div className="grid grid-cols-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                   <div className="col-span-2">Usuário / Ação</div>
                   <div>Data</div>
                   <div className="text-right">Status</div>
                </div>
             </div>
             <div className="divide-y divide-white/5">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : activities.length > 0 ? (
                  activities.map((activity) => (
                    <ActivityRow 
                      key={activity.id + activity.date}
                      user={activity.user} 
                      action={activity.action} 
                      date={formatTimeAgo(activity.date)} 
                      status={activity.status} 
                    />
                  ))
                ) : (
                  <div className="py-20 text-center text-zinc-500 text-sm">
                    Nenhuma atividade recente encontrada.
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold px-2">Status do Sistema</h3>
           <div className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-900/20 space-y-8">
              <HealthItem label="API Supabase" status="Operational" />
              <HealthItem label="Database Cluster" status="Operational" />
              <HealthItem label="Cakto Webhook" status="Operational" />
              <HealthItem label="Storage (S3)" status="Low Space" warning />
              
              <div className="pt-4">
                 <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">
                    VER LOGS TÉCNICOS
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, trend, icon }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950 hover:border-primary/30 hover:shadow-[0_0_50px_rgba(255,45,141,0.08)] hover:bg-zinc-900/30 transition-all space-y-4 group cursor-pointer"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-primary/10 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-all duration-300">
         {icon}
      </div>
      <div>
         <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">{label}</p>
         <h2 className="text-3xl font-bold mt-1 tracking-tighter group-hover:text-white transition-colors">{value}</h2>
      </div>
      <div className={cn(
        "text-[10px] font-bold flex items-center gap-1 transition-transform group-hover:translate-x-1 duration-300",
        trend === "up" ? "text-emerald-500" : "text-red-500"
      )}>
        {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </motion.div>
  );
}

function ActivityRow({ user, action, date, status }: any) {
  return (
    <motion.div 
      whileHover={{ x: 6, backgroundColor: "rgba(255, 255, 255, 0.02)" }}
      className="p-6 flex items-center justify-between border-l-2 border-transparent hover:border-primary transition-all cursor-pointer group"
    >
       <div className="col-span-2 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
             <Clock className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors" />
          </div>
          <div>
             <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{user}</p>
             <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{action}</p>
          </div>
       </div>
       <div className="text-xs text-zinc-600 font-medium group-hover:text-zinc-500 transition-colors">{date}</div>
       <div className="text-right">
          {status === "completed" && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />}
          {status === "pending" && <div className="w-2 h-2 rounded-full bg-amber-500 ml-auto animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />}
          {status === "failed" && <AlertCircle className="w-5 h-5 text-red-500 ml-auto drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]" />}
       </div>
    </motion.div>
  );
}

function HealthItem({ label, status, warning }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.01] hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-default"
    >
       <span className="text-xs font-medium text-zinc-500">{label}</span>
       <div className="flex items-center gap-2">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest",
            warning ? "text-amber-500" : "text-emerald-500"
          )}>{status}</span>
          <div className={cn(
            "w-2 h-2 rounded-full",
            warning ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] bg-glow" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] bg-glow"
          )} />
       </div>
    </motion.div>
  );
}
