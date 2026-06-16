-- ============================================================
-- VIVA AI — Schema do Banco de Dados
-- ============================================================
-- Execute este arquivo no SQL Editor do Supabase.
-- Ordem importa: tabelas referenciadas devem existir antes.

-- ── profiles ────────────────────────────────────────────────
-- Perfil público da usuária, vinculado ao auth.users
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  full_name      text,
  avatar_url     text,
  city           text,
  birth_date     date,
  style_preferences text[] default '{}',
  goals          text[]   default '{}',
  interests      text[]   default '{}',
  average_budget numeric,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ── user_events ──────────────────────────────────────────────
-- Eventos pessoais criados pela usuária (Modo Evento)
create table if not exists public.user_events (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade,
  title          text not null,
  event_type     text,
  event_date     date,
  location       text,
  desired_style  text,
  budget         numeric,
  emotional_goal text,
  notes          text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ── event_plans ──────────────────────────────────────────────
-- Planos de preparação gerados para cada evento
create table if not exists public.event_plans (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid references auth.users(id) on delete cascade,
  event_id             uuid references public.user_events(id) on delete cascade,
  look_suggestion      text,
  beauty_suggestion    text,
  checklist            jsonb default '[]'::jsonb,
  routine              jsonb default '[]'::jsonb,
  recommended_items    jsonb default '[]'::jsonb,
  motivational_message text,
  created_at           timestamptz default now()
);

-- ── diary_entries ─────────────────────────────────────────────
-- Diário emocional — dados sensíveis protegidos por RLS
create table if not exists public.diary_entries (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  mood          text,
  content       text,
  ai_reflection text,   -- reflexão mockada local, sem IA real na V1
  created_at    timestamptz default now()
);

-- ── favorites ─────────────────────────────────────────────────
-- Favoritos (produtos, looks, etc.)
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  item_type  text not null,   -- 'product' | 'look' | 'event'
  item_id    text not null,
  metadata   jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  unique(user_id, item_type, item_id)
);

-- ── habits_progress ───────────────────────────────────────────
-- Progresso diário de hábitos (estrutura pronta para V2)
create table if not exists public.habits_progress (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade,
  habit_key      text not null,
  completed_date date not null,
  xp_earned      integer default 0,
  created_at     timestamptz default now(),
  unique(user_id, habit_key, completed_date)
);

-- ── chat_messages ─────────────────────────────────────────────
-- Histórico do chat com IA (IA real entra na V2)
create table if not exists public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  role       text check (role in ('user', 'assistant')),
  content    text,
  created_at timestamptz default now()
);

-- ── affiliate_clicks ──────────────────────────────────────────
-- Rastreamento de cliques em links de afiliados
create table if not exists public.affiliate_clicks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  product_id  uuid,
  source      text,
  clicked_url text,
  created_at  timestamptz default now()
);

-- ── products ──────────────────────────────────────────────────
-- Produtos/promoções cadastrados pelo admin
-- Na V1: somente leitura para usuários autenticados
-- Escrita admin: será via server action com role admin na V2
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  category         text,
  store            text,
  old_price        numeric,
  current_price    numeric,
  discount_percent integer,
  image_url        text,
  affiliate_url    text,
  tag              text,
  status           text default 'active',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── app_events ────────────────────────────────────────────────
-- Eventos públicos/descobrir (cadastrados pelo admin)
-- Na V1: somente leitura para usuários autenticados
-- Escrita admin: será via server action com role admin na V2
create table if not exists public.app_events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  city         text,
  location     text,
  event_date   date,
  category     text,
  price        numeric,
  image_url    text,
  external_url text,
  status       text default 'active',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── Trigger: updated_at automático ────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'profiles_updated_at') then
    create trigger profiles_updated_at before update on public.profiles
      for each row execute function public.handle_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'user_events_updated_at') then
    create trigger user_events_updated_at before update on public.user_events
      for each row execute function public.handle_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'products_updated_at') then
    create trigger products_updated_at before update on public.products
      for each row execute function public.handle_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'app_events_updated_at') then
    create trigger app_events_updated_at before update on public.app_events
      for each row execute function public.handle_updated_at();
  end if;
end;
$$;

-- ── Trigger: criar profile após signup ────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
