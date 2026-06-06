Crie uma plataforma SaaS moderna chamada “Vault 1.0”.

OBJETIVO:
A plataforma será uma área premium de conteúdos sobre IA, prompts e criação de sites modernos utilizando inteligência artificial.

O sistema deve possuir:
- autenticação de usuários
- dashboard protegida
- integração futura com pagamentos
- organização de prompts
- biblioteca de vídeos
- experiência premium e minimalista
- arquitetura escalável

STACK OBRIGATÓRIA:
- Next.js 15
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Supabase Auth
- Framer Motion
- Lucide Icons

ESTILO VISUAL:
Criar interface extremamente moderna e minimalista.

REFERÊNCIAS:
- Linear
- Vercel
- Raycast
- Stripe Dashboard

VISUAL:
- tema escuro
- tons preto/cinza
- detalhes roxo neon
- glassmorphism leve
- sombras suaves
- animações fluidas
- aparência premium SaaS
- tipografia moderna
- muito espaçamento
- design clean
- interface cinematográfica

ESTRUTURA DO SISTEMA:

1. LANDING PAGE

Criar:
- hero section moderna
- headline impactante
- CTA principal
- seção de benefícios
- seção mostrando conteúdos
- cards premium
- FAQ
- depoimentos fictícios
- footer moderno

BOTÃO CTA:
“QUERO ACESSAR O VAULT”

Adicionar animações suaves com Framer Motion.

────────────────────

2. AUTENTICAÇÃO

Criar:
- login
- cadastro
- recuperação de senha
- proteção de rotas
- middleware auth

Utilizar Supabase Auth.

Após login:
redirecionar para:
```bash
/dashboard

────────────────────

DASHBOARD

Criar dashboard premium estilo SaaS.

A dashboard deve possuir:

SIDEBAR:

Dashboard
Prompts
Vídeos
Templates
Favoritos
Perfil
Configurações

TOPBAR:

busca
avatar usuário
notificações

HOME DASHBOARD:
Criar métricas fictícias:

prompts disponíveis
vídeos disponíveis
templates
conteúdos novos

Adicionar:

gráficos modernos
cards premium
animações suaves

────────────────────

PÁGINA DE PROMPTS

Criar biblioteca completa.

Cada prompt deve possuir:

título
categoria
nível
descrição
botão copiar
botão favorito

Adicionar:

sistema de busca
filtros
categorias
paginação

Categorias:

Landing Pages
SaaS
UI Design
Dashboards
Automação
Branding
Copywriting

Criar prompts fictícios realistas.

────────────────────

PÁGINA DE VÍDEOS

Criar:

cards de vídeos
miniaturas premium
categorias
player moderno
progresso de visualização

Adicionar módulos:

Como usar IA
Como criar sites
Como lançar projetos
GitHub & Vercel
Engenharia de Prompt

────────────────────

PÁGINA DE TEMPLATES

Criar:

cards premium
preview visual
tags
botão download
botão visualizar

Adicionar templates fictícios:

Landing Page SaaS
Dashboard Financeiro
Agência Premium
Imobiliária de Luxo
Clínica Estética

────────────────────

PERFIL DO USUÁRIO

Criar:

foto
nome
email
plano atual
alterar senha
preferências

────────────────────

BANCO DE DADOS

Criar schema Prisma completo.

Tabelas:

users
prompts
categories
favorites
videos
templates
progress

────────────────────

API

Criar API estruturada:

autenticação
prompts
favoritos
vídeos
templates

Utilizar:

route handlers do Next.js
arquitetura limpa
boas práticas
validações

────────────────────

SEGURANÇA

Adicionar:

middleware auth
proteção JWT
validação de inputs
rate limiting
sanitização
proteção de rotas privadas

────────────────────

RESPONSIVIDADE

O sistema deve funcionar perfeitamente:

mobile
tablet
desktop

────────────────────

EXPERIÊNCIA PREMIUM

Adicionar:

transições suaves
loading skeletons
hover animations
blur effects
gradient orbs
motion transitions
microinterações

────────────────────

ORGANIZAÇÃO

Estruturar projeto profissionalmente:

src/
 ├── app/
 ├── components/
 ├── lib/
 ├── hooks/
 ├── services/
 ├── prisma/
 ├── styles/
 └── types/

────────────────────

WEBHOOK FUTURO

Preparar endpoint:

/api/webhooks/cakto

Esse endpoint será usado futuramente para:

receber confirmação de pagamento
liberar acesso do usuário
ativar planos

────────────────────

OBJETIVO FINAL

O resultado deve parecer:

um SaaS real
produto premium
startup moderna
plataforma escalável

NÃO criar aparência genérica.

Criar algo visualmente impressionante, extremamente profissional e pronto para produção.

O código deve ser limpo, moderno, componentizado e escalável.