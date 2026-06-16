'use client';

/**
 * VIVA AI — Hook: useProfile
 *
 * Carrega e salva o perfil da usuária no Supabase.
 * Fallback para mockUser quando Supabase não está configurado.
 *
 * PRIVACIDADE: dados de perfil nunca são logados em produção.
 */
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { useAuth } from '@/contexts/AuthContext';
import { mockUser } from '@/data/mock';
import { safeLog, safeError } from '@/lib/security/privacy';

export interface ProfileData {
  full_name: string;
  city: string;
  birth_date: string;
  style_preferences: string[];
  goals: string[];
  interests: string[];
  average_budget: number;
  avatar_url: string;
}

const defaultProfile: ProfileData = {
  full_name: mockUser.name,
  city: mockUser.city,
  birth_date: '',
  style_preferences: mockUser.fashionPreferences,
  goals: mockUser.objectives,
  interests: mockUser.interests,
  average_budget: mockUser.averageBudget,
  avatar_url: mockUser.avatar ?? '',
};

export function useProfile() {
  const { user, isConfigured } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(isConfigured);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega o perfil do Supabase
  useEffect(() => {
    if (!isConfigured || !user) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from('profiles')
      .select('full_name, city, birth_date, style_preferences, goals, interests, average_budget, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data, error: err }) => {
        if (err && err.code !== 'PGRST116') {
          safeError('useProfile: load error', err);
          setError('Não foi possível carregar o perfil.');
        } else if (data) {
          safeLog('useProfile: loaded');
          setProfile({
            full_name: data.full_name ?? '',
            city: data.city ?? '',
            birth_date: data.birth_date ?? '',
            style_preferences: data.style_preferences ?? [],
            goals: data.goals ?? [],
            interests: data.interests ?? [],
            average_budget: data.average_budget ?? 0,
            avatar_url: data.avatar_url ?? '',
          });
        }
        setLoading(false);
      });
  }, [isConfigured, user]);

  const saveProfile = useCallback(
    async (updates: Partial<ProfileData>) => {
      setSaving(true);
      setSaveSuccess(false);
      setError(null);

      // Fallback: sem Supabase, apenas mostra sucesso visual
      if (!isConfigured || !user) {
        setTimeout(() => {
          setProfile((prev) => ({ ...prev, ...updates }));
          setSaving(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }, 500);
        return;
      }

      const supabase = createClient();
      const { error: err } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        });

      if (err) {
        safeError('useProfile: save error', err);
        setError('Não foi possível salvar o perfil. Tente novamente.');
      } else {
        safeLog('useProfile: saved');
        setProfile((prev) => ({ ...prev, ...updates }));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
      setSaving(false);
    },
    [isConfigured, user]
  );

  return { profile, loading, saving, saveSuccess, error, saveProfile, setProfile };
}
