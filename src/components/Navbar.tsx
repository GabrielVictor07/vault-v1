"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass mx-auto mt-4 max-w-5xl rounded-2xl"
    >
      <Link href="/" className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-primary" />
        <span className="text-xl font-bold tracking-tighter">VAULT <span className="text-primary">1.0</span></span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <Link href="#features" className="hover:text-white transition-colors">Benefícios</Link>
        <Link href="#content" className="hover:text-white transition-colors">Conteúdo</Link>
        <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
          Entrar
        </Link>
        <Link
          href="/login?signup=true"
          className="bg-primary hover:bg-accent text-white px-5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
        >
          ACESSAR AGORA
        </Link>
      </div>
    </motion.nav>
  );
}
