"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, FileText, ArrowLeft, Lock, HelpCircle, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import Link from "next/link";

export default function TermsAndPrivacyPage() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
  const [activeSection, setActiveSection] = useState<string>("section-1");

  const termsSections = [
    { id: "section-1", title: "1. Aceitação dos Termos", content: "Ao acessar ou utilizar a plataforma Vault 1.0, você concorda e se submete integralmente a estes Termos de Uso. Se você não concorda com qualquer parte destas condições, não deverá utilizar nossos serviços, conteúdos ou ferramentas disponibilizadas." },
    { id: "section-2", title: "2. Licença de Uso e Acesso", content: "Concedemos a você uma licença limitada, pessoal, não exclusiva, intransferível e revogável para acessar e utilizar os conteúdos (prompts, vídeos, templates e materiais educacionais) do Vault 1.0 estritamente para seu uso pessoal ou para desenvolvimento profissional individual. É expressamente proibida a redistribuição, revenda, sublicenciamento ou qualquer compartilhamento de contas e materiais com terceiros." },
    { id: "section-3", title: "3. Cadastro e Segurança da Conta", content: "Para utilizar as funcionalidades exclusivas da plataforma, você deve criar uma conta utilizando um e-mail válido. Você é o único responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas sob sua conta. Contas compartilhadas ou com acessos suspeitos de múltiplos locais simultâneos poderão ser bloqueadas permanentemente sem direito a reembolso." },
    { id: "section-4", title: "4. Planos, Cobrança e Reembolso", content: "O Vault 1.0 disponibiliza acesso premium mediante planos pagos processados via Cakto. As compras dão direito ao plano selecionado pelo período contratado. Em conformidade com a legislação de defesa do consumidor, oferecemos garantia de reembolso incondicional de até 7 dias a partir da data de confirmação do pagamento, solicitável diretamente pelo suporte." },
    { id: "section-5", title: "5. Limitação de Responsabilidade", content: "Nossas ferramentas e prompts de inteligência artificial são fornecidos 'no estado em que se encontram'. Embora nos esforcemos para entregar a máxima precisão e qualidade nos materiais de apoio, não garantimos resultados comerciais específicos, lucros ou o funcionamento ininterrupto de serviços de terceiros (como OpenAI, Anthropic, Supabase etc.) integrados ao seu fluxo de trabalho." },
    { id: "section-6", title: "6. Modificações nos Termos", content: "Reservamo-nos o direito de alterar estes Termos a qualquer momento. Mudanças significativas serão notificadas através do sistema ou por e-mail. A continuidade do uso do Vault 1.0 após tais modificações constitui a aceitação tácita dos novos termos revisados." },
  ];

  const privacySections = [
    { id: "section-1", title: "1. Coleta de Informações", content: "Coletamos apenas as informações estritamente necessárias para o funcionamento seguro e personalizado da plataforma. Isso inclui: seu nome completo, e-mail (para login e sincronização de compras Cakto), telefone/WhatsApp (se fornecido voluntariamente no perfil), logs de último acesso para segurança de login e histórico de progresso e favoritos de aulas." },
    { id: "section-2", title: "2. Utilização dos Dados", content: "Os dados coletados são utilizados exclusivamente para: autenticar sua conta com segurança via Supabase Auth, conceder acesso imediato ao plano adquirido, registrar seu histórico de aprendizado (favoritos e aulas completadas), responder a chamados de suporte e enviar notificações importantes do sistema (como atualizações de conteúdo ou avisos de manutenção)." },
    { id: "section-3", title: "3. Compartilhamento e Segurança", content: "Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing. O compartilhamento ocorre estritamente com provedores de infraestrutura técnica necessários para a operação do serviço (como Supabase para banco de dados e autenticação, e Cakto para validação de faturamento). Todos os dados são transmitidos com criptografia SSL/TLS de nível industrial." },
    { id: "section-4", title: "4. Sessões Ativas e Dispositivos", content: "Para sua segurança e proteção contra fraudes, a plataforma registra sessões ativas (IP aproximado, tipo de navegador e data de acesso). Você pode gerenciar e desconectar dispositivos indesejados a qualquer momento diretamente pela sua tela de configurações do cliente." },
    { id: "section-5", title: "5. Seus Direitos (LGPD)", content: "Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você possui o direito de: acessar, corrigir, atualizar ou solicitar a exclusão definitiva dos seus dados pessoais dos nossos sistemas. Tais solicitações podem ser feitas a qualquer momento em nosso e-mail oficial de suporte ou painel de configurações." },
    { id: "section-6", title: "6. Cookies e Rastreamento", content: "Utilizamos cookies funcionais para lembrar suas preferências de login, estado do menu e tema do sistema. Você pode configurar seu navegador para recusar cookies, mas isso poderá desabilitar o funcionamento correto da sua sessão persistente na plataforma." },
  ];

  const currentSections = activeTab === "terms" ? termsSections : privacySections;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Neon Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Dot Grid Background */}
      <div className="absolute inset-0 bg-dot opacity-40 pointer-events-none" />

      {/* Main Header / Topbar */}
      <header className="border-b border-border bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="p-2.5 rounded-xl border border-border hover:bg-secondary/50 text-zinc-400 hover:text-white transition-all flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold tracking-tighter text-xl text-white">VAULT 1.0</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link 
              href="/login" 
              className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-sm font-semibold hover:text-white transition-all"
            >
              Entrar na Área de Membros
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 border-b border-border bg-black/20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary">
            <Lock className="w-3.5 h-3.5" />
            Políticas & Transparência
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gradient">
            Termos & Privacidade
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-base">
            Leia atentamente as diretrizes operacionais, de segurança e tratamento de dados que garantem a segurança do seu acesso no Vault 1.0.
          </p>

          {/* Tab Switcher */}
          <div className="flex justify-center p-1 bg-secondary border border-border rounded-2xl max-w-sm mx-auto mt-8">
            <button
              onClick={() => {
                setActiveTab("terms");
                setActiveSection("section-1");
              }}
              className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === "terms"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              Termos de Uso
            </button>
            <button
              onClick={() => {
                setActiveTab("privacy");
                setActiveSection("section-1");
              }}
              className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === "privacy"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Shield className="w-4 h-4" />
              Privacidade
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar (lg:col-span-1) */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="glass p-5 rounded-2xl border border-border sticky top-28 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Atualizado em Maio/2026
            </h3>
            
            <nav className="space-y-1">
              {currentSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className={`w-full text-left py-2 px-3 rounded-xl text-sm font-semibold transition-all border ${
                    activeSection === sec.id
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-secondary/30"
                  }`}
                >
                  {sec.title.split(".")[0] + ". " + sec.title.split(".")[1]}
                </button>
              ))}
            </nav>

            <hr className="border-border" />

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-400">Precisa de ajuda?</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Se você tiver dúvidas sobre estes termos ou como tratamos seus dados pessoais, entre em contato.
              </p>
              <Link
                href="/login?help=true"
                className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
              >
                <HelpCircle className="w-4 h-4" />
                Falar com o Suporte
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Section (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {currentSections.map((sec) => (
                <div
                  key={sec.id}
                  id={sec.id}
                  className={`glass p-8 rounded-3xl border transition-all duration-300 ${
                    activeSection === sec.id
                      ? "border-primary/40 shadow-[0_0_20px_rgba(168,85,247,0.05)] bg-[#0c0c0c]"
                      : "border-border hover:border-zinc-800"
                  }`}
                >
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="w-1.5 h-6 rounded-full bg-primary" />
                    {sec.title}
                  </h2>
                  <p className="text-zinc-300 leading-relaxed text-base font-normal">
                    {sec.content}
                  </p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Highlights Card */}
          <div className="glass p-8 rounded-3xl border border-dashed border-primary/20 bg-primary/[0.02] grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 h-fit">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">O que é garantido?</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Garantia legal de reembolso de 7 dias, proteção total aos seus dados de pagamento via Cakto, e controle completo sobre suas sessões ativas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 h-fit">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">O que é proibido?</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Não é permitida a distribuição, revenda ou compartilhamento de acessos da conta com terceiros. Acessos simultâneos indevidos serão bloqueados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-black/60 py-8 text-center text-xs text-zinc-500 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Vault 1.0. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <button 
              onClick={() => { setActiveTab("terms"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="hover:text-white transition-all font-semibold"
            >
              Termos de Uso
            </button>
            <button 
              onClick={() => { setActiveTab("privacy"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="hover:text-white transition-all font-semibold"
            >
              Política de Privacidade
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
