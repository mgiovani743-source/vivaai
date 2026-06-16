-- Tabela para capturar leads da waitlist na Landing Page V1
CREATE TABLE IF NOT EXISTS public.waitlist_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    source TEXT DEFAULT 'landing_v1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.waitlist_leads ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir inserção anônima (usuários não logados podem se cadastrar)
CREATE POLICY "Permitir inserções anônimas em waitlist_leads"
ON public.waitlist_leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Política 2: Permitir leitura apenas para administradores (usuários logados como admin no Supabase ou via app)
-- Aqui usamos a role authenticated, mas você pode restringir apenas para admins se desejar
CREATE POLICY "Permitir leitura apenas para auth"
ON public.waitlist_leads
FOR SELECT
TO authenticated
USING (true);
