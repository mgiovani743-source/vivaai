/**
 * VIVA AI — Proxy (Autenticação e Roteamento)
 *
 * Nota: A partir do Next.js 16, o arquivo 'middleware.ts' foi depreciado
 * e renomeado para 'proxy.ts'. A função exportada deve se chamar 'proxy'.
 *
 * ── V1 PÚBLICA ──────────────────────────────────────────────────────────
 * O matcher foi limitado a rotas internas (/dashboard/*, /admin, /login,
 * /register). A LP pública em `/` NÃO passa por este proxy e nunca toca
 * o Supabase.
 *
 * ── V2 (quando Auth real estiver ativo) ─────────────────────────────────
 * Para reativar proteção total:
 * 1. Confirmar que NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
 *    estão corretas no .env.local
 * 2. Expandir o matcher para incluir outras rotas se necessário
 *
 * Responsabilidades atuais:
 * 1. Refresh automático do token de sessão via cookies (Supabase SSR)
 * 2. Proteger rotas /dashboard/** — redirecionar para /login se não autenticado
 * 3. Proteger rota /admin — verificar ADMIN_EMAILS (variável server-side)
 * 4. Redirecionar /login e /register para /dashboard se já autenticado
 *
 * SEGURANÇA:
 * - ADMIN_EMAILS nunca é exposta no frontend (sem prefixo NEXT_PUBLIC_)
 * - A verificação de admin ocorre APENAS no servidor
 */
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from '@/lib/supabase/config';

/** Rotas que exigem autenticação */
const PROTECTED_ROUTES = ['/dashboard', '/admin'];

/** Rotas de auth — redireciona para dashboard se já logado */
const AUTH_ROUTES = ['/login', '/register'];

/**
 * Verifica se o e-mail do usuário está na lista de admins.
 * ADMIN_EMAILS é uma variável de ambiente server-side (sem NEXT_PUBLIC_).
 * Exemplo: ADMIN_EMAILS=mgiovani743@gmail.com,outro@email.com
 */
function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const rawEmails = process.env.ADMIN_EMAILS ?? '';
  if (!rawEmails.trim()) return false;
  const adminEmails = rawEmails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se Supabase não estiver configurado, permite tudo (fallback mockado)
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANTE: Não chame código entre createServerClient e getUser
  // para não invalidar os cookies de sessão.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Rota /admin: verificar se é admin por e-mail
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!isAdminEmail(user.email)) {
      // Usuário autenticado mas não é admin
      return NextResponse.redirect(new URL('/dashboard?acesso=negado', request.url));
    }
  }

  // Rotas protegidas gerais: exigem autenticação
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rotas de auth: redirecionar para dashboard se já logado
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * ── V1 PÚBLICA ──────────────────────────────────────────────────────
     * Proxy APENAS em rotas internas. A LP `/` nunca passa por aqui.
     *
     * Rotas cobertas:
     * - /dashboard e todos os sub-caminhos
     * - /admin
     * - /login
     * - /register
     *
     * Rotas EXCLUÍDAS (sem proxy, sem Supabase):
     * - /           ← Landing page pública V1
     * - /_next/*    ← arquivos estáticos do Next.js
     * - /favicon.ico, imagens, fontes, etc.
     *
     * ── V2 (Auth completo) ───────────────────────────────────────────────
     * Para cobrir todas as rotas no futuro, substitua o matcher por:
     * '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
     */
    '/dashboard/:path*',
    '/admin',
    '/login',
    '/register',
  ],
};
