'use client';

/**
 * VIVA AI — Auth Context
 *
 * Fornece o usuário autenticado para todos os componentes client-side.
 * Usa o Supabase Browser Client para manter a sessão sincronizada.
 *
 * Quando Supabase não está configurado, usa dados mockados do mockUser.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { mockUser } from '@/data/mock';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  isConfigured: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(configured); // se não configurado, não há loading

  const mapUser = useCallback((supabaseUser: User | null): AuthUser | null => {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      name:
        supabaseUser.user_metadata?.full_name ??
        supabaseUser.email?.split('@')[0] ??
        'Usuária',
    };
  }, []);

  useEffect(() => {
    if (!configured) {
      // Fallback mockado — usa o mockUser sem Supabase
      setUser({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Pega sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(mapUser(session?.user ?? null));
      setLoading(false);
    });

    // Escuta mudanças de sessão (login, logout, refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(mapUser(session?.user ?? null));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [configured, mapUser]);

  const signOut = useCallback(async () => {
    if (!configured) return;
    const supabase = createClient();
    await supabase.auth.signOut();
  }, [configured]);

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signOut, isConfigured: configured }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
