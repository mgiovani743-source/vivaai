/**
 * VIVA AI — Supabase Server-Side Client
 *
 * Use este cliente em:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 *
 * Lê e escreve cookies de forma segura para SSR.
 * NUNCA use SUPABASE_SERVICE_ROLE_KEY neste arquivo a menos que
 * seja absolutamente necessário para uma operação administrativa server-side.
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // O método setAll pode falhar em Server Components (somente leitura).
          // Isso é esperado — o middleware cuida da atualização dos cookies.
        }
      },
    },
  });
}
