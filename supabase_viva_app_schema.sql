create extension if not exists "pgcrypto";

create table if not exists public.viva_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text null,
  access_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists viva_profiles_email_lower_idx
  on public.viva_profiles (lower(email));

create unique index if not exists viva_profiles_access_token_idx
  on public.viva_profiles (access_token);

create table if not exists public.viva_plans (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.viva_profiles(id) on delete cascade,
  moments text[] not null default '{}',
  feelings text[] not null default '{}',
  styles text[] not null default '{}',
  budget text null,
  event_date text null,
  location text null,
  avoid text null,
  owned_items text null,
  plan jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists viva_plans_profile_created_at_idx
  on public.viva_plans (profile_id, created_at desc);

alter table public.viva_profiles enable row level security;
alter table public.viva_plans enable row level security;
