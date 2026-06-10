-- Migration: Add analytics_events table
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  event_type text not null, -- 'link_click', 'social_click', 'curriculo_click', etc
  target_id text, -- Opcional: ID da entidade clicada (ex: id do linktree) ou identificador (ex: 'linkedin')
  target_label text, -- Opcional: Nome amigável (ex: 'Meus Projetos')
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS (opcional, mas recomendado)
alter table public.analytics_events enable row level security;

-- Políticas
-- 1. Qualquer visitante (anônimo ou não) pode inserir eventos
create policy "Visitantes podem inserir eventos de analytics"
  on public.analytics_events for insert
  with check (true);

-- 2. Apenas o dono do cartão (usuário logado cujo profile.id == user_id) pode ver seus dados
create policy "Dono do card pode ver seus proprios analytics"
  on public.analytics_events for select
  using (auth.uid() = user_id);

-- Opcionalmente permitir deleção pelo dono se quiser
create policy "Dono do card pode deletar seus proprios analytics"
  on public.analytics_events for delete
  using (auth.uid() = user_id);
