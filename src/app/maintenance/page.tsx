"use client";

import { motion } from "framer-motion";
import { Wrench, Shield, RefreshCw } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden select-none">
      
      {/* Premium glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Cyberpunk grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        
        {/* Animated Icon Container */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_50px_rgba(255,45,141,0.1)]">
              <Wrench className="w-10 h-10 animate-pulse" />
            </div>
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black tracking-widest uppercase"
          >
            <Shield className="w-3.5 h-3.5" />
            Sistema em Manutenção
          </motion.div>

          <motion.h1
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-black tracking-tight text-white"
          >
            Vault 1.0 <span className="text-gradient">Offline</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto"
          >
            Estamos realizando upgrades críticos de infraestrutura para melhorar a sua experiência. Retornaremos em instantes!
          </motion.p>
        </div>

        {/* Dynamic button to reload */}
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="pt-4"
        >
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            TENTAR NOVAMENTE
          </button>
        </motion.div>

      </div>
    </div>
  );
}
