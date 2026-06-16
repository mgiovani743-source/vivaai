/**
 * VIVA AI — Supabase Config
 * Verifica se as variáveis de ambiente do Supabase estão configuradas.
 * Usado para ativar o fallback mockado quando não estão.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Retorna true se o Supabase estiver configurado corretamente.
 * Quando false, o app usa dados mockados automaticamente.
 */
export function isSupabaseConfigured(): boolean {
  return (
    SUPABASE_URL.startsWith('https://') &&
    SUPABASE_ANON_KEY.length > 10
  );
}
