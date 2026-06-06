"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield, 
  Play, 
  ChevronDown, 
  Star, 
  Check, 
  DollarSign, 
  HelpCircle, 
  Layers 
} from "lucide-react";
import { getSystemConfig } from "@/app/actions/system";

export default function Home() {
  const [checkoutUrl, setCheckoutUrl] = useState("https://checkout.cakto.com.br/vault-premium");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadConfig() {
      const config = await getSystemConfig();
      if (config?.checkoutUrl) {
        setCheckoutUrl(config.checkoutUrl);
      }
    }
    loadConfig();
  }, []);

  const faqData = [
    {
      question: "O que é o Vault 1.0?",
      answer: "O Vault 1.0 é a cripta definitiva de IA e SaaS. Uma plataforma premium onde você tem acesso instantâneo a uma biblioteca de prompts avançados, aulas práticas de criação de sistemas/templates e recursos exclusivos para alavancar seus negócios."
    },
    {
      question: "Como funciona o Acesso Vitalício?",
      answer: "Você paga uma única vez e tem acesso para sempre! Sem assinaturas mensais, sem taxas escondidas. Você recebe todas as atualizações futuras de prompts, aulas e novos templates sem nenhum custo adicional."
    },
    {
      question: "Os Prompts realmente funcionam?",
      answer: "Sim, absolutamente. Todos os nossos prompts são testados exaustivamente em múltiplos cenários para garantir a máxima taxa de conversão, precisão de cópia e eficiência técnica."
    },
    {
      question: "Comprei com outro e-mail, como sincronizar?",
      answer: "Dentro da sua tela de configurações do cliente, você pode digitar o e-mail que usou para realizar a compra na Cakto e sincronizar o acesso instantaneamente. Nosso sistema cuidará de liberar todos os recursos para você."
    },
    {
      question: "Como funciona o suporte?",
      answer: "Oferecemos um sistema de chamados integrado diretamente na plataforma. Nossa equipe de engenharia e suporte responde às suas dúvidas e problemas técnicos em até 2 horas úteis."
    }
  ];

  const testimonials = [
    {
      name: "Gabriel Motta",
      role: "SaaS Founder & Dev",
      comment: "O Vault 1.0 mudou completamente meu workflow. A qualidade dos prompts de automação e templates me economizaram semanas de desenvolvimento.",
      rating: 5,
      avatar: "G"
    },
    {
      name: "Ana Silva",
      role: "Copywriter Master",
      comment: "A precisão dos prompts do Vault para geração de páginas de vendas de alta conversão é inacreditável. O retorno sobre o investimento foi imediato.",
      rating: 5,
      avatar: "A"
    },
    {
      name: "Lucas Alencar",
      role: "UI/UX Designer",
      comment: "O design minimalista e futurista da plataforma já te dá inspiração imediata. Os templates de frontend que eles disponibilizam são obras de arte.",
      rating: 5,
      avatar: "L"
    }
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden select-none">
      
      {/* Premium glowing backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Cyberpunk grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <Navbar />

      <main className="relative pt-32 px-6">
        
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-8 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Nova Era da Inteligência Artificial
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white"
          >
            Domine a IA no <br />
            <span className="text-gradient">Vault 1.0</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-2xl text-base md:text-lg text-zinc-400 leading-relaxed"
          >
            A área premium definitiva para criadores, copywriters e desenvolvedores que buscam escalar resultados, criar sites modernos e dominar engenharia de prompts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <a 
              href="#pricing"
              className="group relative flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Adquirir Acesso Vitalício
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white hover:bg-white/5 transition-all border border-white/5">
              <Play className="w-4 h-4 fill-current" />
              Ver Trailer
            </button>
          </motion.div>
        </section>

        {/* FEATURE PREVIEW CARDS */}
        <section className="max-w-6xl mx-auto py-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-primary" />}
            title="Prompts que Vendem"
            description="Biblioteca atualizada semanalmente com prompts testados para conversão e produtividade de alta precisão."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-primary" />}
            title="Área Exclusiva"
            description="Dashboard premium para organizar seus favoritos, cursos de vídeo e templates em um só lugar."
            delay={0.5}
          />
          <FeatureCard 
            icon={<Sparkles className="w-6 h-6 text-primary" />}
            title="Design Cinematográfico"
            description="Aprenda a criar interfaces que encantam e vendem utilizando as melhores IAs do mercado."
            delay={0.6}
          />
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="max-w-6xl mx-auto py-16 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Feedback dos Nossos <span className="text-primary">Membros</span></h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">Veja a experiência e resultados reais de quem já faz parte da comunidade Vault.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/20 hover:border-white/10 transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-zinc-800 flex items-center justify-center font-black text-primary text-xs uppercase">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{t.name}</h4>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="max-w-4xl mx-auto py-32 space-y-12 scroll-mt-20">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Adquira Acesso <span className="text-gradient">Vitalício</span></h2>
            <p className="text-zinc-500 text-sm">Aproveite nossa oferta única e ganhe acesso imediato a todas as ferramentas.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-12 rounded-[3.5rem] border border-primary/30 bg-zinc-950/40 relative overflow-hidden group shadow-[0_0_50px_rgba(255,45,141,0.05)]"
          >
            {/* Ambient decorative light */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                    OFERTA VITALÍCIA
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight">Vault Master Access</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Tudo o que você precisa para elevar o nível das suas criações de inteligência artificial de forma simplificada e direta ao ponto.
                  </p>
                </div>

                <ul className="space-y-3">
                  <PricingItem text="Acesso ilimitado à Biblioteca de Prompts" />
                  <PricingItem text="Aulas Práticas e Curso Gravado de IA" />
                  <PricingItem text="Download de Templates Exclusivos" />
                  <PricingItem text="Atualizações semanais inclusas" />
                  <PricingItem text="Suporte premium em até 2 horas" />
                </ul>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-black/60 border border-white/5 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Preço de Lançamento</span>
                
                <div className="flex flex-col items-center justify-center">
                  <span className="text-zinc-600 line-through text-xs font-bold uppercase tracking-wider">De R$ 297,00</span>
                  <div className="flex items-baseline gap-1 mt-1 text-white">
                    <span className="text-lg font-bold">R$</span>
                    <span className="text-6xl font-black tracking-tighter text-gradient">97</span>
                    <span className="text-xs font-bold text-zinc-500">,00</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-2">Pagamento Único (Sem Mensalidade)</span>
                </div>

                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-primary hover:bg-accent text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <DollarSign className="w-4 h-4" />
                  GARANTIR ACESSO AGORA
                </a>
              </div>

            </div>
          </motion.div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-4xl mx-auto py-16 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Dúvidas <span className="text-primary">Frequentes</span></h2>
            <p className="text-zinc-500 text-sm">As respostas para as principais dúvidas sobre nossa cripta.</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-[2rem] border border-white/5 bg-zinc-950/20 overflow-hidden transition-all hover:border-white/10"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between gap-4 select-none"
                  >
                    <span className="text-sm font-extrabold text-zinc-100 flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-primary/70" />
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-zinc-500"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-8 pb-6 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 mt-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-extrabold tracking-tighter text-white">VAULT<span className="text-primary font-black">.</span>ONE</span>
          </div>
          <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">© 2026 Vault Platform. Todos os direitos reservados.</p>
          <div className="flex gap-6 text-xs text-zinc-500 font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/20 hover:border-primary/30 transition-all hover:bg-zinc-950/40 group"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-3 text-white">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-xs">
        {description}
      </p>
    </motion.div>
  );
}

function PricingItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2.5 text-zinc-300 text-xs font-medium">
      <div className="w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
        <Check className="w-3.5 h-3.5" />
      </div>
      {text}
    </li>
  );
}
