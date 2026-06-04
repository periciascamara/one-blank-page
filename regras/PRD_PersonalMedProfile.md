# PRD — Personal Med Profile (One Blank Page)

> **Versão:** 1.1.0
> **Data:** 2026-06-04
> **Status:** Rascunho
> **Autor:** Equipe Editora Viva
> **Contato:** contatos@editoraviva.art.br | WhatsApp: +55 31 99957-2799
> **Changelog v1.1.0:** Backend migrado de Firebase para **Supabase** (PostgreSQL + Auth + Storage + Edge Functions + RLS).

---

## 1. Visão Geral

### 1.1 Resumo Executivo

O **Personal Med Profile** (plataforma "One Blank Page") é um sistema SaaS de criação e gestão de cartões de carreira digitais voltado a profissionais da área médica e pericial. A plataforma permite que cada profissional centralize, em um único link público, todas as suas informações de contato, portfólio (documentos LaTeX, repositórios GitHub), badges de validação profissional (registro CRM, certificações de perito) e redes sociais.

O produto resolve um problema recorrente no mercado profissional médico: a dispersão de identidade digital em múltiplas plataformas sem um ponto de acesso unificado, visual e de alta confiabilidade. O cartão digital funciona como um "link-in-bio" evoluído, com frente/verso interativo, geração de QR Code em alta resolução, suporte a NFC e controle total pelo próprio profissional via dashboard protegida por autenticação.

O modelo de monetização é baseado em planos (Simples, Médio e Completo) com bloqueio lógico de funcionalidades por nível. O controle de acesso é implementado via **Supabase Row Level Security (RLS)** e metadados de usuário armazenados na tabela `profiles`, gerenciados pelo administrador via dashboard administrativo.

### 1.2 Objetivos de Negócio

- Lançar o MVP com os três planos funcionais em até 90 dias após aprovação deste PRD.
- Alcançar 200 usuários ativos nos primeiros 3 meses pós-lançamento.
- Garantir taxa de retenção mensal ≥ 70% nos primeiros 6 meses.
- Reduzir o custo de suporte com automação de gestão de planos pelo painel admin.
- Estabelecer a marca "One Blank Page" como referência em cartões digitais para profissionais de saúde no Brasil.

### 1.3 Métricas de Sucesso (KPIs)

| Métrica | Meta | Prazo |
|---------|------|-------|
| Usuários ativos (DAU) | 200 | 3 meses pós-lançamento |
| Taxa de retenção mensal | ≥ 70% | 6 meses |
| Perfis públicos criados | 150 | 3 meses |
| QR Codes baixados | 100 | 3 meses |
| NPS (Net Promoter Score) | ≥ 50 | 6 meses |
| Tempo médio de criação do cartão | < 10 min | A partir do lançamento |

---

## 2. Personas e Usuários-Alvo

### 2.1 Persona Principal — Profissional Médico / Perito Judicial

- **Nome fictício:** Dr. Rafael Moraes
- **Perfil:** Médico perito judicial, 38 anos, atuante em processos trabalhistas e previdenciários. Possui registro CRM, certificação de perito, perfil no LinkedIn e produção acadêmica publicada.
- **Dores:**
  - Dificuldade de compartilhar suas credenciais de forma rápida e confiável.
  - Precisa apresentar portfólio (laudos em PDF/LaTeX, GitHub) em contextos distintos.
  - Cartões físicos ficam desatualizados; QR Codes genéricos não transmitem credibilidade.
- **Objetivos:**
  - Ter um link único e verificável que comprove suas qualificações.
  - Gerar QR Code para cartões físicos e materiais gráficos.
  - Controlar quais informações ficam visíveis para o público.
- **Nível técnico:** Intermediário — usa smartphone, LinkedIn e Google Drive com conforto, mas não é desenvolvedor.

### 2.2 Personas Secundárias

**Administrador da Plataforma (Editora Viva)**
- Gerencia usuários, altera planos manualmente, monitora o crescimento da base.
- Nível técnico: Alto — familiar com Supabase Studio e dashboards administrativos.

**Profissional de Saúde em Geral (não perito)**
- Médico, psicólogo, fisioterapeuta que deseja cartão digital para divulgação de consultório.
- Foco em redes sociais, links de agendamento e contato via WhatsApp.

---

## 3. Escopo do Produto

### 3.1 MVP — Funcionalidades Essenciais

| ID | Funcionalidade | Prioridade | Complexidade |
|----|---------------|------------|--------------|
| F01 | Landing Page pública com Hero dinâmico e CTAs | Must Have | Baixa |
| F02 | Cadastro e autenticação de usuários (Supabase Auth) | Must Have | Média |
| F03 | Cartão Digital público — Frente (foto, nome, QR, contatos) | Must Have | Média |
| F04 | Cartão Digital público — Verso (formação, links, badges, redes sociais, linktree) | Must Have | Alta |
| F05 | Animação de flip frente/verso no cartão | Must Have | Média |
| F06 | Dashboard pessoal — gestão de links e dados do cartão | Must Have | Alta |
| F07 | Gerador de QR Code (download PNG/SVG ≥ 1024px) | Must Have | Média |
| F08 | Controle de status do cartão (Ativar / Dormir / Apagar) | Must Have | Baixa |
| F09 | Painel de customização (layout, cores, fundo) | Must Have | Alta |
| F10 | Seleção de 3 layouts de apresentação do cartão | Must Have | Média |
| F11 | Ícone NFC no cartão | Must Have | Baixa |
| F12 | Gestão de planos e RBAC via Supabase RLS + tabela `profiles` | Must Have | Alta |
| F13 | Dashboard Administrativo (listagem de usuários, alteração de planos) | Must Have | Alta |
| F14 | Ativação/desativação de badges por usuário | Must Have | Baixa |

### 3.2 Roadmap Pós-MVP

| Fase | Funcionalidades | Prazo estimado |
|------|----------------|----------------|
| v1.1 | Métricas de clique por link e por cartão via tabela `click_events`; integração com Google Analytics 4 | 30 dias após MVP |
| v1.2 | Portfólio/Documentos (upload de PDF via Supabase Storage, link GitHub, LaTeX viewer) — plano Completo | 60 dias após MVP |
| v1.3 | Suporte Prioritário via chat (plano Completo); automação de upgrade de plano via pagamento | 90 dias após MVP |
| v2.0 | App mobile PWA; exportação do cartão como imagem de alta resolução; templates por especialidade médica | 6 meses |

### 3.3 Fora de Escopo (v1.0)

- Processamento de pagamentos automatizado (upgrade de plano é manual pelo admin).
- Integração direta com LinkedIn API para sincronização de dados.
- Suporte a idiomas além do Português Brasileiro.
- App nativo iOS/Android.
- Geração de cartão físico (impressão via fornecedor terceiro).

---

## 4. Requisitos Funcionais

### F01 — Landing Page Pública

**Descrição:** Página inicial acessível sem autenticação. Contém seção hero com imagem de fundo configurável e dois CTAs principais.

**User Stories:**
- Como visitante, quero ver uma apresentação atraente da plataforma para decidir me cadastrar.
- Como administrador, quero configurar a imagem de fundo do hero sem alterar código.

**Critérios de Aceite:**
- [ ] Hero exibe imagem de fundo com overlay configurável (URL armazenada na tabela `platform_settings`).
- [ ] CTA "Cadastrar Currículo" redireciona para `/register`.
- [ ] CTA "Entrar na Dashboard" redireciona para `/login`.
- [ ] Página renderiza em menos de 2s em conexão 4G.
- [ ] Layout responsivo (mobile-first).

**Regras de Negócio:**
- RN01: A imagem de fundo do hero é configurável apenas pelo perfil administrador via tabela `platform_settings` com RLS restritiva.

---

### F02 — Autenticação de Usuários

**Descrição:** Cadastro e login via **Supabase Auth** (email/senha). Papéis e planos definidos na tabela `profiles`, lidos via RLS nas demais tabelas.

**User Stories:**
- Como novo usuário, quero me cadastrar com e-mail e senha para criar meu cartão.
- Como usuário existente, quero fazer login para acessar meu dashboard.

**Critérios de Aceite:**
- [ ] Cadastro com e-mail, senha (mínimo 8 caracteres) e nome completo.
- [ ] Verificação de e-mail enviada após cadastro via Supabase Auth (SMTP configurado).
- [ ] Login redireciona para `/dashboard` se `role = 'usuario'` ou `/admin` se `role = 'admin'` (lido de `profiles`).
- [ ] Logout encerra sessão (Supabase `signOut()`) e redireciona para `/`.
- [ ] Recuperação de senha via e-mail funcional (Supabase Auth Magic Link / Reset Password).

**Regras de Negócio:**
- RN01: Após cadastro, um Supabase **Database Trigger** (`on_auth_user_created`) insere automaticamente uma linha em `profiles` com `plano = 'simples'` e `role = 'usuario'`.
- RN02: O campo `role` em `profiles` só pode ser alterado por um usuário com `role = 'admin'` (garantido por RLS Policy).

---

### F03 — Cartão Digital Público — Frente

**Descrição:** Face frontal do cartão digital, acessível publicamente via URL única do profissional.

**User Stories:**
- Como visitante, quero ver a foto, nome e formas de contato do profissional rapidamente.
- Como profissional, quero que meu QR Code seja exibido na frente para facilitar o compartilhamento.

**Critérios de Aceite:**
- [ ] Exibe foto profissional em formato circular ou retangular (conforme layout escolhido).
- [ ] Exibe nome completo e título/especialidade.
- [ ] Exibe QR Code gerado automaticamente apontando para a URL pública do perfil.
- [ ] Botões de contato: telefone, WhatsApp, e-mail (configuráveis pelo usuário).
- [ ] Ícone NFC visível com tooltip "Compatível com NFC".
- [ ] Clique no cartão aciona animação flip para o verso.
- [ ] URL pública no formato: `https://app.dominio.com/p/{username}`.

**Regras de Negócio:**
- RN01: O cartão público só é acessível se `cards.status = 'ativo'`. Status `'dormindo'` exibe página de indisponibilidade temporária. Status `'apagado'` retorna HTTP 404.
- RN02: A consulta do cartão público usa a Supabase **anon key** com RLS Policy `SELECT` liberada apenas para `status = 'ativo'`.

---

### F04 — Cartão Digital Público — Verso

**Descrição:** Face traseira do cartão com informações aprofundadas do profissional.

**User Stories:**
- Como visitante, quero ver a formação acadêmica e especialidades do profissional.
- Como profissional, quero exibir meus links de portfólio e redes sociais de forma organizada.

**Critérios de Aceite:**
- [ ] Exibe formação acadêmica (array JSONB `cards.formacao`).
- [ ] Exibe lista de especialidades (array JSONB `cards.especialidades`).
- [ ] Exibe links de portfólio (tabela `portfolio_links`) — disponível conforme plano.
- [ ] Exibe badges de validação (tabela `badges`) — disponível conforme plano.
- [ ] Exibe links de redes sociais: LinkedIn, Instagram, TikTok (JSONB `cards.redes_sociais`).
- [ ] Seção "Meus Projetos" no estilo linktree com links da tabela `linktree_links`.
- [ ] Link/botão para site pessoal ou link externo principal.
- [ ] Clique aciona flip de volta para a frente.

**Regras de Negócio:**
- RN01: Badges só aparecem se `profiles.plano IN ('medio', 'completo')` E `badges.ativo = true`.
- RN02: Links de portfólio só aparecem se `profiles.plano = 'completo'`.
- RN03: A validação de plano ocorre no servidor via **Supabase Edge Function** antes de retornar os dados ao cliente.

---

### F05 — Animação de Flip Frente/Verso

**Descrição:** Transição animada em CSS 3D ao clicar no cartão, alternando entre frente e verso.

**Critérios de Aceite:**
- [ ] Animação flip 3D suave (duração ≤ 600ms) via Framer Motion.
- [ ] Funciona em Chrome, Firefox, Safari e Edge (últimas 2 versões).
- [ ] Funciona em dispositivos touch (tap no mobile).
- [ ] Acessibilidade: botão "Ver mais informações" visível para leitores de tela.

---

### F06 — Dashboard Pessoal

**Descrição:** Área autenticada onde cada usuário gerencia exclusivamente seu próprio cartão.

**User Stories:**
- Como usuário, quero editar meus dados e links sem precisar de suporte técnico.
- Como usuário, quero ver quais funcionalidades estão disponíveis no meu plano atual.

**Critérios de Aceite:**
- [ ] Acesso restrito ao próprio usuário autenticado (Supabase RLS: `auth.uid() = user_id`).
- [ ] Formulário de edição: foto, nome, título, formação, especialidades, contatos, links de redes sociais, links linktree.
- [ ] Preview em tempo real do cartão ao editar (Supabase Realtime subscription na tabela `cards`).
- [ ] Indicação visual clara de funcionalidades bloqueadas pelo plano (cadeado + "Upgrade necessário").
- [ ] Botões de ação: Ativar / Dormir / Apagar o cartão.

**Regras de Negócio:**
- RN01: RLS Policy garante que `SELECT`, `UPDATE` e `DELETE` em `cards` só funcionam para `auth.uid() = cards.user_id`.
- RN02: A ação "Apagar" exige confirmação dupla (modal com digitação do e-mail). O registro é marcado como `status = 'apagado'`; hard delete agendado via **pg_cron** para 30 dias depois.

---

### F07 — Gerador de QR Code

**Descrição:** Ferramenta no dashboard que gera o QR Code do perfil público com download em alta resolução.

**Critérios de Aceite:**
- [ ] QR Code gerado no cliente via biblioteca `qrcode` (npm) — sem carga no servidor.
- [ ] Download disponível em PNG (mínimo 1024×1024px) e SVG (vetorial).
- [ ] Opção de personalizar cor do QR Code e cor de fundo.
- [ ] QR Code na frente do cartão público é gerado automaticamente ao carregar a página.
- [ ] QR Code escanável e funcional validado por testes E2E.

---

### F08 — Controle de Status do Cartão

**Descrição:** O usuário pode gerenciar o estado de visibilidade do seu cartão público.

**Critérios de Aceite:**
- [ ] **Ativo** (`status = 'ativo'`): Cartão público acessível normalmente.
- [ ] **Dormindo** (`status = 'dormindo'`): URL pública exibe página "Perfil em manutenção".
- [ ] **Apagado** (`status = 'apagado'`): URL retorna HTTP 404; dados removidos via `pg_cron` após 30 dias.
- [ ] Mudança de status via `UPDATE cards SET status = $1 WHERE user_id = auth.uid()` reflete em < 30s no perfil público (Supabase Realtime ou revalidação de cache Next.js).

---

### F09 — Painel de Customização

**Descrição:** Interface no dashboard para personalizar a aparência do cartão público.

**Critérios de Aceite:**
- [ ] Seleção de 3 layouts pré-definidos (armazenado em `cards.layout`).
- [ ] Seletor de cor primária e cor de fundo (armazenado em `cards.customizacao` como JSONB).
- [ ] Upload de imagem de fundo personalizada (max 2MB, JPG/PNG/WebP) para **Supabase Storage** bucket `card-backgrounds`.
- [ ] Preview ao vivo do cartão com as customizações aplicadas.
- [ ] Botão "Restaurar padrões" zera o JSONB `customizacao` para valores default.

---

### F10 — Seleção de Layouts

**Descrição:** Três opções de layout para o cartão digital público.

**Critérios de Aceite:**
- [ ] Layout 1 — **Minimalista:** Fundo branco/cinza, tipografia limpa, foto circular.
- [ ] Layout 2 — **Moderno:** Gradiente de cor, foto retangular com bordas arredondadas, badges em destaque.
- [ ] Layout 3 — **Acadêmico:** Fundo escuro/navy, tipografia serifada, ênfase em formação e publicações.
- [ ] Valor persiste em `cards.layout` (enum PostgreSQL: `'minimalista' | 'moderno' | 'academico'`).

---

### F11 — Indicador NFC

**Descrição:** Ícone visual no cartão indicando compatibilidade com NFC para transmissão de contatos.

**Critérios de Aceite:**
- [ ] Ícone NFC exibido na frente do cartão (posição configurável em `cards.customizacao`).
- [ ] Tooltip ao passar o mouse: "Este cartão suporta transmissão de contatos via NFC".
- [ ] Funcional para dispositivos com NFC via Web NFC API (Chrome Android).
- [ ] Em dispositivos sem suporte, o ícone é exibido como informativo sem funcionalidade.

---

### F12 — Gestão de Planos e RBAC

**Descrição:** Controle de acesso baseado em papéis (RBAC) usando **Supabase Row Level Security (RLS)** e a tabela `profiles`.

**User Stories:**
- Como administrador, quero alterar o plano de qualquer usuário sem precisar editar código.
- Como usuário plano Simples, não quero ver funcionalidades do plano Médio habilitadas.

**Critérios de Aceite:**
- [ ] Planos: `simples`, `medio`, `completo` — armazenados em `profiles.plano` (enum PostgreSQL).
- [ ] Tabela de funcionalidades por plano respeitada via RLS Policies e validação nas Edge Functions.
- [ ] Funcionalidades bloqueadas exibem UI de cadeado — dados reais nunca chegam ao cliente.
- [ ] Alteração de plano pelo admin via `UPDATE profiles SET plano = $1 WHERE id = $2` protegida por RLS Policy de admin.

**Regras de Negócio:**

| Funcionalidade | Simples | Médio | Completo |
|---------------|---------|-------|----------|
| Cartão Digital (Frente/Verso) | ✅ | ✅ | ✅ |
| Badges de Validação | ❌ | ✅ | ✅ |
| Métricas de Clique | ❌ | ✅ | ✅ |
| Portfólio/Documentos | ❌ | ❌ | ✅ |
| Suporte Prioritário | ❌ | ❌ | ✅ |

---

### F13 — Dashboard Administrativo

**Descrição:** Painel exclusivo do administrador para gestão global de usuários e plataforma.

**User Stories:**
- Como administrador, quero ver todos os usuários e seus planos em uma tabela.
- Como administrador, quero alterar o plano de um usuário com um clique.

**Critérios de Aceite:**
- [ ] Acesso restrito via RLS Policy: `SELECT` em `profiles` só retorna todos os registros se `auth.uid()` tem `role = 'admin'` na própria tabela `profiles`.
- [ ] Tabela de usuários: `id`, `email` (via `auth.users`), `plano`, `status` do cartão, `created_at`.
- [ ] Ação inline para Promover / Degradar plano de qualquer usuário.
- [ ] Confirmação antes de alterações destrutivas.
- [ ] Log de auditoria em tabela `admin_logs` (inserção via Database Trigger `on_plan_change`).
- [ ] Configuração da imagem de fundo da landing page via tabela `platform_settings`.

---

### F14 — Ativação/Desativação de Badges

**Descrição:** O usuário pode gerenciar quais badges de validação aparecem no cartão público.

**Critérios de Aceite:**
- [ ] Tabela `badges` com campos: `id`, `user_id`, `label`, `codigo`, `ativo` (boolean).
- [ ] Toggle ativa/desativa `badges.ativo` via `UPDATE badges SET ativo = $1 WHERE id = $2 AND user_id = auth.uid()`.
- [ ] Badge com `ativo = false` não retornado pela query pública.
- [ ] Funcionalidade visível apenas para planos `medio` e `completo`; bloqueada por RLS para `simples`.

---

## 5. Requisitos Não-Funcionais

| Categoria | Requisito | Meta |
|-----------|-----------|------|
| Performance | Tempo de carregamento do cartão público | < 1,5s (LCP) em 4G |
| Performance | Tempo de resposta das queries Supabase | < 100ms (p95) com índices adequados |
| Disponibilidade | Uptime Supabase (Pro plan) | 99,9% mensal (SLA Supabase) |
| Escalabilidade | Conexões simultâneas ao banco | Pool via Supabase Pooler (PgBouncer) |
| Segurança | Autenticação | Supabase Auth (JWT, bcrypt nativo) |
| Segurança | Autorização | RLS Policies por tabela + validação em Edge Functions |
| Conformidade | Proteção de dados | LGPD — consentimento explícito, exclusão via `pg_cron` |
| Acessibilidade | Padrão mínimo | WCAG 2.1 AA |
| SEO | Cartão público indexável | Meta tags Open Graph e Schema.org Person (Next.js SSR) |
| Compatibilidade | Browsers | Chrome, Firefox, Safari, Edge (últimas 2 versões) |
| Compatibilidade | Mobile | iOS 15+, Android 10+ |

---

## 6. Arquitetura Técnica

### 6.1 Visão Geral da Arquitetura

Arquitetura Jamstack com backend **Supabase** (PostgreSQL gerenciado):

```
Usuário (Browser/Mobile)
         │
         ▼
  CDN (Vercel Edge Network)
         │
    Next.js 14 (App Router + SSR)
         │
    ┌────┴───────────────────────────┐
    │                                │
Supabase Auth                 Supabase Database
(JWT, Magic Link,             (PostgreSQL 15)
 Email Verification)          RLS Policies
    │                                │
    └────────────┬───────────────────┘
                 │
    ┌────────────┼────────────────────┐
    │            │                   │
Supabase     Supabase Edge       Supabase
Storage      Functions           Realtime
(Imagens,    (Lógica de          (Preview ao
 Fotos)       negócio segura,     vivo no
              validação plano)    dashboard)
```

### 6.2 Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | Next.js 14 (App Router) + TypeScript | SSR para SEO do cartão público; React Server Components |
| Estilização | Tailwind CSS + Shadcn/ui | Produtividade, consistência visual, dark mode nativo |
| Animações | Framer Motion | Flip 3D fluido e controlável via código |
| Geração QR Code | `qrcode` (npm) | Suporte a SVG e PNG, geração no cliente sem carga no servidor |
| **Banco de Dados** | **Supabase — PostgreSQL 15** | SQL relacional, RLS nativa, backups automáticos, dashboard visual (Supabase Studio) |
| **Autenticação** | **Supabase Auth** | JWT, email/senha, magic link, reset de senha, verificação de e-mail — sem servidor extra |
| **Armazenamento de arquivos** | **Supabase Storage** | Buckets com políticas RLS, CDN integrado, resize via transformações |
| **Lógica de backend** | **Supabase Edge Functions** (Deno) | Funções serverless para validação de plano, logs de auditoria e operações admin |
| **Realtime** | **Supabase Realtime** | WebSockets sobre PostgreSQL para preview ao vivo no dashboard |
| **Agendamento** | **pg_cron** (extensão PostgreSQL) | Hard delete de cartões após 30 dias, limpeza de logs |
| Infraestrutura | Vercel (frontend) + Supabase Cloud | Deploy automático por branch; CDN global; regiões SA (São Paulo) disponíveis |
| CI/CD | GitHub Actions | Integração com Vercel e `supabase db push` para migrations |
| Monitoramento | Supabase Dashboard Logs + Sentry | Query performance, erros de Edge Function, Core Web Vitals |

### 6.3 Modelo de Dados (PostgreSQL / Supabase)

#### Tabela: `profiles`
Estende `auth.users` do Supabase. Criada automaticamente via trigger `on_auth_user_created`.

```sql
CREATE TYPE plano_enum AS ENUM ('simples', 'medio', 'completo');
CREATE TYPE role_enum  AS ENUM ('usuario', 'admin');

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  nome        TEXT NOT NULL,
  username    TEXT UNIQUE NOT NULL,          -- slug único para URL pública
  role        role_enum NOT NULL DEFAULT 'usuario',
  plano       plano_enum NOT NULL DEFAULT 'simples',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Usuário lê apenas o próprio perfil
CREATE POLICY "usuario_le_proprio_perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admin lê todos
CREATE POLICY "admin_le_todos"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin atualiza qualquer perfil (inclusive plano/role)
CREATE POLICY "admin_atualiza_qualquer_perfil"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Usuário atualiza apenas campos não sensíveis do próprio perfil
CREATE POLICY "usuario_atualiza_proprio_perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (role = 'usuario');  -- impede auto-promoção para admin
```

#### Tabela: `cards`

```sql
CREATE TYPE status_enum  AS ENUM ('ativo', 'dormindo', 'apagado');
CREATE TYPE layout_enum  AS ENUM ('minimalista', 'moderno', 'academico');

CREATE TABLE cards (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  foto_url     TEXT,
  nome         TEXT NOT NULL,
  titulo       TEXT,
  formacao     JSONB DEFAULT '[]',           -- [{"grau": "...", "instituicao": "..."}]
  especialidades JSONB DEFAULT '[]',         -- ["Perícia Médica", "Medicina do Trabalho"]
  contatos     JSONB DEFAULT '{}',           -- {"telefone": "", "whatsapp": "", "email": ""}
  redes_sociais JSONB DEFAULT '{}',          -- {"linkedin": "", "instagram": "", "tiktok": "", "site": ""}
  layout       layout_enum NOT NULL DEFAULT 'minimalista',
  customizacao JSONB DEFAULT '{}',           -- {"cor_primaria": "#hex", "cor_fundo": "#hex", "imagem_fundo_url": ""}
  nfc_ativo    BOOLEAN NOT NULL DEFAULT true,
  status       status_enum NOT NULL DEFAULT 'ativo',
  deleted_at   TIMESTAMPTZ,                  -- usado pelo pg_cron para hard delete
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Leitura pública apenas de cartões ativos
CREATE POLICY "leitura_publica_cartao_ativo"
  ON cards FOR SELECT
  USING (status = 'ativo');

-- Usuário gerencia apenas o próprio cartão
CREATE POLICY "usuario_gerencia_proprio_cartao"
  ON cards FOR ALL
  USING (auth.uid() = user_id);
```

#### Tabela: `badges`

```sql
CREATE TABLE badges (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label     TEXT NOT NULL,     -- "CRM SP 123456"
  codigo    TEXT,
  ativo     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario_gerencia_badges"
  ON badges FOR ALL
  USING (auth.uid() = user_id);

-- Leitura pública apenas de badges ativos (verificada junto ao plano na Edge Function)
CREATE POLICY "leitura_publica_badges_ativos"
  ON badges FOR SELECT
  USING (ativo = true);
```

#### Tabela: `linktree_links`

```sql
CREATE TABLE linktree_links (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label     TEXT NOT NULL,
  url       TEXT NOT NULL,
  ordem     INT NOT NULL DEFAULT 0,
  ativo     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE linktree_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario_gerencia_linktree"
  ON linktree_links FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "leitura_publica_links_ativos"
  ON linktree_links FOR SELECT
  USING (ativo = true);
```

#### Tabela: `portfolio_links` (plano Completo)

```sql
CREATE TABLE portfolio_links (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label     TEXT NOT NULL,
  url       TEXT NOT NULL,
  tipo      TEXT CHECK (tipo IN ('github', 'latex', 'pdf', 'outro')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE portfolio_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario_gerencia_portfolio"
  ON portfolio_links FOR ALL
  USING (auth.uid() = user_id);
```

#### Tabela: `admin_logs`

```sql
CREATE TABLE admin_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID NOT NULL REFERENCES profiles(id),
  acao        TEXT NOT NULL,
  target_id   UUID,
  dados_antes JSONB,
  dados_depois JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "somente_admin_le_logs"
  ON admin_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

#### Tabela: `platform_settings`

```sql
CREATE TABLE platform_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Apenas admin atualiza
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leitura_publica_settings"
  ON platform_settings FOR SELECT USING (true);

CREATE POLICY "admin_atualiza_settings"
  ON platform_settings FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

#### Trigger: `on_auth_user_created`

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, username, role, plano)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', ''),
    LOWER(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), '[^a-z0-9]', '-', 'g')),
    'usuario',
    'simples'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

#### pg_cron: Hard Delete Agendado

```sql
-- Executar diariamente à meia-noite: hard delete de cartões apagados há mais de 30 dias
SELECT cron.schedule(
  'hard-delete-cards',
  '0 0 * * *',
  $$
    DELETE FROM cards
    WHERE status = 'apagado'
      AND deleted_at < now() - INTERVAL '30 days';
  $$
);
```

### 6.4 Design da API

O frontend Next.js 14 comunica com o Supabase de duas formas:

**a) Supabase Client SDK** (no browser / Server Components) — para operações CRUD simples já protegidas por RLS.

**b) Supabase Edge Functions** (Deno) — para operações que requerem lógica de negócio adicional, como validação de plano antes de retornar dados sensíveis.

**Base URL Edge Functions:** `https://{project-ref}.supabase.co/functions/v1`
**Autenticação:** `Authorization: Bearer <supabase-jwt>`

| Método | Endpoint (Edge Function) | Descrição | Auth |
|--------|--------------------------|-----------|------|
| GET | `/public-card/{username}` | Retorna dados do cartão respeitando regras de plano | ❌ (anon) |
| PATCH | `/admin/update-plan` | Altera plano de usuário + insere log de auditoria | ✅ Admin |
| GET | `/metrics/clicks/{user_id}` | Retorna métricas de clique (planos médio/completo) | ✅ Usuário |
| POST | `/card/soft-delete` | Marca cartão como apagado + define `deleted_at` | ✅ Usuário |

#### Exemplo — Alterar Plano (Admin via Edge Function)
```http
PATCH /functions/v1/admin/update-plan
Authorization: Bearer <supabase-jwt-admin>
Content-Type: application/json

{
  "target_user_id": "uuid-do-usuario",
  "novo_plano": "completo"
}

# Response 200
{
  "id": "uuid-do-usuario",
  "plano": "completo",
  "updated_at": "2026-06-04T12:00:00Z"
}
```

#### Exemplo — Query SDK (cartão público no Server Component Next.js)
```typescript
// app/p/[username]/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function CardPage({ params }: { params: { username: string } }) {
  const supabase = createClient()

  const { data: card } = await supabase
    .from('cards')
    .select(`
      *,
      profiles!inner(username, plano),
      badges(label, codigo),
      linktree_links(label, url, ordem)
    `)
    .eq('profiles.username', params.username)
    .eq('status', 'ativo')
    .single()

  if (!card) return notFound()

  return <CardPublico card={card} />
}
```

### 6.5 Integrações Externas

| Serviço | Finalidade | Tipo de Integração |
|---------|-----------|-------------------|
| Supabase Auth | Login, registro, recuperação de senha, verificação de e-mail | SDK `@supabase/ssr` |
| Supabase Database (PostgreSQL) | Banco de dados principal com RLS | SDK + REST API |
| Supabase Storage | Upload de fotos e imagens de fundo (bucket `card-backgrounds`, `profile-photos`) | SDK |
| Supabase Edge Functions | Lógica de negócio segura, validação de plano, logs de auditoria | Deno / REST |
| Supabase Realtime | Preview ao vivo no dashboard via WebSocket | SDK |
| pg_cron | Agendamento de hard deletes e limpeza de dados | Extensão PostgreSQL nativa no Supabase |
| Sentry | Monitoramento de erros em produção | SDK JavaScript + Deno (Edge Functions) |
| Web NFC API (nativo browser) | Transmissão de contato via NFC | API nativa (Chrome Android) |

### 6.6 Segurança

- **Autenticação:** Supabase Auth com verificação de e-mail obrigatória antes de acessar o dashboard.
- **Autorização:** RLS Policies por tabela — nenhuma tabela é acessível sem política explícita.
- **Separação de chaves:** `anon key` usada no cliente (só acessa dados públicos via RLS); `service_role key` usada apenas em Edge Functions (nunca exposta ao browser).
- **HTTPS:** Obrigatório em todos os endpoints (Supabase e Vercel fornecem por padrão).
- **Rate Limiting:** Supabase API Gateway com limite de 1000 req/min por projeto; Edge Functions com throttle customizado por `user_id`.
- **Upload de imagens:** Políticas de Storage (RLS em buckets) validam que apenas o dono do perfil pode fazer upload; tamanho máximo 2MB configurado no bucket.
- **LGPD:**
  - Consentimento explícito no cadastro (checkbox com link para Política de Privacidade).
  - Exclusão de dados: `status = 'apagado'` imediato + `pg_cron` para hard delete após 30 dias.
  - Dados sensíveis (e-mail) não expostos no cartão público sem opt-in explícito do usuário.
  - Supabase hospedado na região `sa-east-1` (São Paulo) para conformidade de residência de dados.

---

## 7. UX / Interface

### 7.1 Fluxos Principais

**Fluxo 1: Novo Usuário — Criar Cartão**
1. Usuário acessa `/` (Landing Page).
2. Clica em "Cadastrar Currículo".
3. Preenche formulário de cadastro (nome, e-mail, senha).
4. Supabase Auth envia e-mail de verificação.
5. Usuário confirma e-mail → Trigger cria linha em `profiles` e redireciona para `/dashboard/setup`.
6. Wizard de configuração inicial: foto, nome, título, especialidade.
7. Escolhe layout e customização.
8. Cartão gerado; URL e QR Code disponíveis imediatamente.

**Fluxo 2: Usuário Existente — Editar Cartão**
1. Usuário acessa `/login`.
2. Autentica com Supabase Auth (email/senha).
3. É redirecionado para `/dashboard`.
4. Navega para "Meu Cartão" > edita campos desejados.
5. Supabase Realtime atualiza o preview ao vivo.
6. Clica em "Salvar" → `UPDATE cards` via SDK → mudanças refletem no perfil público em < 30s.

**Fluxo 3: Visitante — Visualizar Cartão Público**
1. Visitante acessa `https://app.dominio.com/p/{username}`.
2. Next.js Server Component faz query no Supabase com `anon key` (RLS retorna apenas cartões ativos).
3. Vê frente do cartão (foto, nome, contatos, QR Code).
4. Clica/toca no cartão → animação flip → vê verso (formação, links, badges).
5. Clica em link de rede social ou projeto → abre em nova aba.

**Fluxo 4: Administrador — Alterar Plano**
1. Admin acessa `/admin` (autenticado com `role = 'admin'`).
2. Vê tabela de usuários (query com RLS de admin).
3. Clica em "Editar Plano" no usuário desejado.
4. Seleciona novo plano no dropdown → confirma.
5. Edge Function `admin/update-plan` executa `UPDATE profiles` + insere em `admin_logs`.
6. Log registrado em `admin_logs` com `dados_antes` e `dados_depois`.

### 7.2 Telas / Páginas

| Rota | Tela | Autenticação |
|------|------|--------------|
| `/` | Landing Page | ❌ |
| `/register` | Cadastro (Supabase Auth) | ❌ |
| `/login` | Login (Supabase Auth) | ❌ |
| `/dashboard` | Dashboard pessoal — visão geral | ✅ Usuário |
| `/dashboard/card` | Editor do cartão digital | ✅ Usuário |
| `/dashboard/qrcode` | Gerador de QR Code | ✅ Usuário |
| `/dashboard/settings` | Configurações de conta e LGPD | ✅ Usuário |
| `/p/{username}` | Cartão público do profissional (SSR) | ❌ |
| `/admin` | Dashboard administrativo | ✅ Admin |
| `/admin/users` | Listagem e gestão de usuários | ✅ Admin |

---

## 8. Infraestrutura e Deploy

### 8.1 Ambientes

| Ambiente | URL | Backend Supabase | Propósito |
|----------|-----|-----------------|-----------|
| Development | `localhost:3000` | Supabase Local (`supabase start`) | Dev local com Docker |
| Staging | `staging.oneblanknpage.com.br` | Projeto Supabase `staging` | QA / homologação |
| Production | `app.oneblanknpage.com.br` | Projeto Supabase `production` (região `sa-east-1`) | Produção |

> **Supabase Local Development:** O CLI do Supabase (`supabase start`) inicializa um stack PostgreSQL + Auth + Storage + Edge Functions completo via Docker, sem custo e sem conexão à internet necessária para desenvolvimento.

### 8.2 Pipeline CI/CD

1. Push para branch `develop` → testes unitários e lint via GitHub Actions.
2. `supabase db diff` gera migration automaticamente se houver mudanças no schema.
3. PR aprovado para `main` → deploy automático no Vercel (staging) + `supabase db push` no projeto staging.
4. Tag `vX.Y.Z` em `main` → deploy manual para produção com aprovação do admin + `supabase db push` em produção.
5. Edge Functions deployadas via `supabase functions deploy <nome>`.

### 8.3 Estimativa de Infraestrutura (custo mensal — MVP ~200 usuários)

| Serviço | Tier | Custo estimado |
|---------|------|----------------|
| Supabase Free (banco, auth, storage, edge functions) | Free (até 500MB DB, 1GB Storage, 2M Edge invocações) | R$ 0 |
| Vercel (frontend hosting + CDN) | Hobby (gratuito) | R$ 0 |
| Sentry (monitoramento) | Developer (gratuito) | R$ 0 |
| **Total estimado MVP** | | **R$ 0/mês** |
| Escala (v2.0 — 5.000 usuários) | Supabase Pro (~US$ 25/mês) + Vercel Pro | ~R$ 250–500/mês |

> **Nota:** O Supabase Pro inclui SLA de 99,9% de uptime, backups diários com retenção de 7 dias, suporte por e-mail e sem limitação de usuários ativos — recomendado a partir do lançamento em produção.

---

## 9. Plano de Testes

| Tipo | Ferramenta | Cobertura mínima |
|------|-----------|-----------------|
| Unitários | Jest + Testing Library | 80% das funções de negócio |
| Integração DB | `supabase test db` (pgTAP) | 100% das RLS Policies e Triggers |
| Integração API | Supertest + Supabase Local | Todos os endpoints das Edge Functions |
| E2E | Playwright + Supabase Local | Fluxos F01→F04, F06, F07, F13 |
| Performance | Lighthouse CI | LCP < 1,5s, CLS < 0,1 |
| Segurança RLS | pgTAP (via `supabase test db`) | Todas as policies de todas as tabelas |
| Acessibilidade | axe-core (integrado ao Playwright) | 0 violações críticas WCAG 2.1 AA |

---

## 10. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Limite do plano gratuito Supabase atingido antes do esperado | Baixa | Médio | Migrar para Supabase Pro (US$ 25/mês); monitorar uso no Supabase Dashboard |
| RLS Policy mal configurada expondo dados de outros usuários | Média | Alto | Cobertura 100% de RLS Policies com pgTAP; revisão de segurança antes do lançamento |
| Web NFC API com baixo suporte em browsers | Alta | Baixo | Tratar como feature progressiva; ícone decorativo em browsers sem suporte |
| Usuários não verificando e-mail após cadastro | Média | Médio | Supabase Auth envia lembrete automático; bloquear dashboard sem verificação |
| Performance de queries complexas com JOIN em PostgreSQL | Baixa | Médio | Índices em `username`, `user_id`, `status`; EXPLAIN ANALYZE em queries críticas |
| Violação de LGPD por exposição de dados | Baixa | Alto | Dados hospedados em `sa-east-1` (SP); RLS estrita; hard delete via `pg_cron` |
| Escalabilidade de conexões ao banco | Média | Alto | Supabase Pooler (PgBouncer) habilitado por padrão; connection pooling no SDK |

---

## 11. Dependências e Premissas

**Dependências:**
- Conta Supabase criada com projetos separados para `staging` e `production`.
- Supabase CLI instalado localmente para desenvolvimento e migrations (`npm i -g supabase`).
- Docker instalado para `supabase start` (dev local).
- Domínio registrado e apontando para Vercel.
- Repositório GitHub com branch protection rules ativas.
- SMTP configurado no Supabase Auth (ex: Resend, SendGrid) para envio de e-mails transacionais.

**Premissas:**
- O upgrade/downgrade de plano é manual pelo administrador (sem automação de pagamento no MVP).
- O domínio final ainda não foi definido; usar `oneblanknpage.com.br` como placeholder.
- Os dados de seed serão inseridos via `supabase/seed.sql` no ambiente de desenvolvimento.
- A equipe de desenvolvimento tem familiaridade com PostgreSQL e Next.js.
- Conteúdo jurídico (Termos de Uso, Política de Privacidade) será fornecido pelo cliente antes do lançamento.

---

## 12. Configuração de Ambiente — Seed Data (`supabase/seed.sql`)

```sql
-- Inserir usuários de teste diretamente em auth.users (apenas para desenvolvimento local)
-- Em produção, usuários são criados via Supabase Auth API

INSERT INTO public.profiles (id, email, nome, username, role, plano) VALUES
  ('00000000-0000-0000-0000-000000000001', 'contatos@editoraviva.art.br', 'Administrador Editora Viva', 'admin', 'admin', 'completo'),
  ('00000000-0000-0000-0000-000000000002', 'usuario1@teste.com', 'Usuário Teste 1', 'usuario1', 'usuario', 'simples'),
  ('00000000-0000-0000-0000-000000000003', 'usuario2@teste.com', 'Usuário Teste 2', 'usuario2', 'usuario', 'medio'),
  ('00000000-0000-0000-0000-000000000004', 'usuario3@teste.com', 'Usuário Teste 3', 'usuario3', 'usuario', 'medio'),
  ('00000000-0000-0000-0000-000000000005', 'usuario4@teste.com', 'Usuário Teste 4', 'usuario4', 'usuario', 'completo'),
  ('00000000-0000-0000-0000-000000000006', 'usuario5@teste.com', 'Usuário Teste 5', 'usuario5', 'usuario', 'completo');

-- Configurações da plataforma
INSERT INTO public.platform_settings (key, value) VALUES
  ('hero_image_url', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d'),
  ('hero_overlay_opacity', '0.6');
```

---

## 13. Canais de Suporte e Governança

| Canal | Contato |
|-------|---------|
| E-mail | contatos@editoraviva.art.br |
| WhatsApp | +55 31 99957-2799 |
| LinkedIn | linkedin.com/in/gcamara |

**Versionamento:** Semantic Versioning (SemVer) — padrão `Major.Minor.Patch` (ex: v1.0.0).
**Ciclo de releases:** Patches semanais; Minor mensais; Major semestral.

---

## 14. Glossário

| Termo | Definição |
|-------|-----------|
| Cartão Digital | Página web pública que representa o perfil profissional do usuário, com frente/verso interativo |
| Badge | Marcador visual que indica uma validação profissional (ex: CRM, certificação de perito) |
| Linktree | Seção do verso do cartão com lista de links de projetos, no estilo da plataforma Linktree |
| RLS | Row Level Security — mecanismo nativo do PostgreSQL/Supabase para controlar acesso linha a linha |
| RBAC | Role-Based Access Control — controle de acesso baseado em papéis/funções |
| Supabase Auth | Serviço de autenticação do Supabase baseado em JWT (substitui Firebase Auth) |
| Supabase Edge Functions | Funções serverless em Deno hospedadas no Supabase (substitui Firebase Functions) |
| Supabase Storage | Serviço de armazenamento de arquivos do Supabase com RLS (substitui Firebase Storage) |
| Supabase Realtime | Serviço de WebSockets do Supabase baseado em replicação PostgreSQL (substitui Firestore Listeners) |
| pg_cron | Extensão PostgreSQL para agendamento de jobs SQL dentro do banco de dados |
| pgTAP | Framework de testes unitários para PostgreSQL, usado para validar RLS Policies |
| Plano | Nível de assinatura do usuário (`simples`, `medio`, `completo`) que define as funcionalidades disponíveis |
| NFC | Near Field Communication — tecnologia de transmissão de dados por proximidade (≤ 4cm) |
| SemVer | Semantic Versioning — sistema de numeração de versões: Major.Minor.Patch |
| Flip | Animação 3D de rotação que alterna a visualização entre a frente e o verso do cartão |
| QR Code | Código de barras bidimensional que aponta para a URL pública do perfil |
| LGPD | Lei Geral de Proteção de Dados (Lei nº 13.709/2018) — regulamentação brasileira de privacidade |

---

*Documento gerado com auxílio de IA. Revisar e validar com o time antes de iniciar o desenvolvimento.*
*Versão 1.1.0 — Personal Med Profile / One Blank Page — Editora Viva © 2026*
*Changelog: Backend migrado de Firebase para Supabase (PostgreSQL + Auth + Storage + Edge Functions + RLS).*
