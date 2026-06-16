'use client';

/**
 * VIVA AI — Hook: useDiary
 *
 * Carrega e salva entradas do diário emocional no Supabase.
 * Fallback para mockDiaryEntries quando Supabase não está configurado.
 *
 * PRIVACIDADE CRÍTICA:
 * - Nunca fazer console.log do conteúdo do diário
 * - Nunca enviar conteúdo do diário para IA (shouldSendToAI sempre retorna false na V1)
 * - Reflexão da IA é mockada localmente nesta versão
 */
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { useAuth } from '@/contexts/AuthContext';
import { mockDiaryEntries } from '@/data/mock';
import { safeLog, safeError } from '@/lib/security/privacy';
import type { DiaryEntry, MoodType } from '@/types';

/** Reflexões mockadas locais — substituir por IA real na V2 */
const MOCK_AI_REFLECTIONS = [
  'Que lindo! Percebo que você tem se sentido bem nos dias que pratica autocuidado. Continue assim! 💜',
  'Obrigada por compartilhar. Seus registros mostram força e autoconhecimento. Cada dia é uma nova oportunidade! 🌸',
  'Notei que sua energia está crescendo ao longo da semana. Seus hábitos estão fazendo diferença! ✨',
  'Sua jornada de evolução é inspiradora. Lembre-se de celebrar cada pequena vitória! 🌟',
];

function getMockReflection(): string {
  return MOCK_AI_REFLECTIONS[Math.floor(Math.random() * MOCK_AI_REFLECTIONS.length)];
}

export function useDiary() {
  const { user, isConfigured } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>(
    isConfigured ? [] : mockDiaryEntries
  );
  const [loading, setLoading] = useState(isConfigured);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured || !user) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from('diary_entries')
      .select('id, mood, content, ai_reflection, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data, error: err }) => {
        if (err) {
          safeError('useDiary: load error', err);
          setError('Não foi possível carregar o diário.');
          // Fallback para mock em caso de erro
          setEntries(mockDiaryEntries);
        } else {
          safeLog('useDiary: loaded entries count', data?.length ?? 0);
          setEntries(
            (data ?? []).map((row) => ({
              id: row.id,
              date: row.created_at?.split('T')[0] ?? '',
              mood: row.mood as MoodType,
              content: row.content ?? '',
              aiAnalysis: row.ai_reflection ?? undefined,
            }))
          );
        }
        setLoading(false);
      });
  }, [isConfigured, user]);

  const addEntry = useCallback(
    async (mood: MoodType, content: string): Promise<boolean> => {
      if (!mood || !content.trim()) return false;
      setSaving(true);
      setError(null);

      // Reflexão mockada local — NÃO enviar para IA na V1
      // shouldSendToAI(content) === false sempre na V1
      const aiReflection = getMockReflection();

      const newEntry: DiaryEntry = {
        id: `d-local-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        mood,
        content: content.trim(),
        aiAnalysis: aiReflection,
      };

      if (!isConfigured || !user) {
        // Fallback: apenas adiciona na memória
        setEntries((prev) => [newEntry, ...prev]);
        setSaving(false);
        return true;
      }

      const supabase = createClient();
      const { data, error: err } = await supabase
        .from('diary_entries')
        .insert({
          user_id: user.id,
          mood,
          content: content.trim(),
          ai_reflection: aiReflection,
        })
        .select('id, mood, content, ai_reflection, created_at')
        .single();

      if (err) {
        safeError('useDiary: save error', err);
        setError('Não foi possível salvar o registro. Tente novamente.');
        setSaving(false);
        return false;
      }

      safeLog('useDiary: entry saved');
      setEntries((prev) => [
        {
          id: data.id,
          date: data.created_at?.split('T')[0] ?? newEntry.date,
          mood: data.mood as MoodType,
          content: data.content ?? '',
          aiAnalysis: data.ai_reflection ?? undefined,
        },
        ...prev,
      ]);
      setSaving(false);
      return true;
    },
    [isConfigured, user]
  );

  return { entries, loading, saving, error, addEntry };
}
