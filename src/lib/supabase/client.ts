/**
 * VIVA AI — Supabase Client-Side Client
 *
 * Use este cliente em:
 * - Componentes com 'use client'
 * - Hooks client-side
 *
 * NUNCA use SUPABASE_SERVICE_ROLE_KEY aqui.
 * Usa apenas NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
