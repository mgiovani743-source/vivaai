-- ============================================================
-- VIVA AI — Row Level Security (RLS) Policies
-- ============================================================
-- Execute APÓS o schema.sql no SQL Editor do Supabase.
-- Estas policies garantem que cada usuária só acessa seus dados.

-- ── Habilitar RLS em todas as tabelas ─────────────────────────
alter table public.profiles         enable row level security;
alter table public.user_events      enable row level security;
alter table public.event_plans      enable row level security;
alter table public.diary_entries    enable row level security;
alter table public.favorites        enable row level security;
alter table public.habits_progress  enable row level security;
alter table public.chat_messages    enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.products         enable row level security;
alter table public.app_events       enable row level security;

-- ── profiles ──────────────────────────────────────────────────
-- Usuária só vê e edita seu próprio perfil
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── user_events ───────────────────────────────────────────────
create policy "user_events: select own"
  on public.user_events for select
  using (auth.uid() = user_id);

create policy "user_events: insert own"
  on public.user_events for insert
  with check (auth.uid() = user_id);

create policy "user_events: update own"
  on public.user_events for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_events: delete own"
  on public.user_events for delete
  using (auth.uid() = user_id);

-- ── event_plans ───────────────────────────────────────────────
create policy "event_plans: select own"
  on public.event_plans for select
  using (auth.uid() = user_id);

create policy "event_plans: insert own"
  on public.event_plans for insert
  with check (auth.uid() = user_id);

-- ── diary_entries ─────────────────────────────────────────────
-- Dados sensíveis — usuária só acessa seu próprio diário
create policy "diary_entries: select own"
  on public.diary_entries for select
  using (auth.uid() = user_id);

create policy "diary_entries: insert own"
  on public.diary_entries for insert
  with check (auth.uid() = user_id);

create policy "diary_entries: update own"
  on public.diary_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "diary_entries: delete own"
  on public.diary_entries for delete
  using (auth.uid() = user_id);

-- ── favorites ─────────────────────────────────────────────────
create policy "favorites: select own"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites: insert own"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites: delete own"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ── habits_progress ───────────────────────────────────────────
create policy "habits_progress: select own"
  on public.habits_progress for select
  using (auth.uid() = user_id);

create policy "habits_progress: insert own"
  on public.habits_progress for insert
  with check (auth.uid() = user_id);

create policy "habits_progress: delete own"
  on public.habits_progress for delete
  using (auth.uid() = user_id);

-- ── chat_messages ─────────────────────────────────────────────
-- Dados sensíveis — nunca serão enviados para IA na V1
create policy "chat_messages: select own"
  on public.chat_messages for select
  using (auth.uid() = user_id);

create policy "chat_messages: insert own"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);

-- ── affiliate_clicks ──────────────────────────────────────────
-- Usuário autenticado pode registrar clique, mas não lê registros
-- Leitura para admin será implementada na V2 via role admin
create policy "affiliate_clicks: insert authenticated"
  on public.affiliate_clicks for insert
  with check (auth.uid() is not null);

-- ── products ──────────────────────────────────────────────────
-- V1: somente leitura de produtos ativos para usuários autenticados
-- INSERT/UPDATE/DELETE bloqueados — escrita admin via role na V2
create policy "products: select active authenticated"
  on public.products for select
  using (auth.uid() is not null and status = 'active');

-- NOTA PARA V2: Adicionar policy de escrita para role 'admin'
-- create policy "products: admin write"
--   on public.products for all
--   using (auth.jwt() ->> 'role' = 'admin');

-- ── app_events ────────────────────────────────────────────────
-- V1: somente leitura de eventos ativos para usuários autenticados
-- INSERT/UPDATE/DELETE bloqueados — escrita admin via role na V2
create policy "app_events: select active authenticated"
  on public.app_events for select
  using (auth.uid() is not null and status = 'active');

-- NOTA PARA V2: Adicionar policy de escrita para role 'admin'
-- create policy "app_events: admin write"
--   on public.app_events for all
--   using (auth.jwt() ->> 'role' = 'admin');
