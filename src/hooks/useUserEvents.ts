'use client';

/**
 * VIVA AI — Hook: useUserEvents
 *
 * Gerencia eventos do usuário (Modo Evento) com persistência no Supabase.
 * Fallback para mockEvents quando Supabase não está configurado.
 *
 * Após criar um evento, gera um plano mockado e salva em event_plans.
 * Plano real com IA será implementado na V2.
 */
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { useAuth } from '@/contexts/AuthContext';
import { mockEvents } from '@/data/mock';
import { safeLog, safeError } from '@/lib/security/privacy';
import type { VivaEvent, EventType, EventPlan } from '@/types';

/** Gera plano mockado — substituir por IA real na V2 */
export function generateMockPlan(
  titulo: string,
  estilo: string,
  objetivo: string
): EventPlan {
  return {
    lookSuggestion: `Para "${titulo}", sugerimos um visual ${
      estilo.toLowerCase() || 'elegante e moderno'
    }. Aposte em peças que transmitam ${
      objetivo.toLowerCase() || 'confiança e autenticidade'
    }. Complemente com acessórios que destaquem sua personalidade.`,
    checklist: [
      'Separar look completo 3 dias antes',
      'Fazer as unhas (mãos e pés)',
      'Hidratar a pele durante a semana',
      'Confirmar transporte e horário',
      'Carregar power bank e documento',
      'Preparar bolsa com essenciais',
    ],
    routine: [
      { day: '5 dias antes', task: 'Iniciar skincare intensiva', done: false },
      { day: '3 dias antes', task: 'Máscara facial + esfoliação', done: false },
      { day: '2 dias antes', task: 'Separar e experimentar look', done: false },
      { day: '1 dia antes', task: 'Preparar bolsa e acessórios', done: false },
      { day: 'No dia', task: 'Skincare + maquiagem + cabelo', done: false },
    ],
    recommendedItems: [
      { name: 'Spray Fixador de Maquiagem', price: 45.9, link: '#' },
      { name: 'Hidratante Corporal Premium', price: 59.9, link: '#' },
      { name: 'Gloss Labial Volumizador', price: 34.9, link: '#' },
      { name: 'Perfume Floral Intenso', price: 129.9, link: '#' },
    ],
    motivationalMessage: `Você merece brilhar em cada momento! ✨ Lembre-se: a preparação faz parte da diversão. Quando o dia chegar, você vai estar radiante e pronta pra viver tudo com intensidade. 💜`,
  };
}

interface NewEventInput {
  tipo: EventType;
  titulo: string;
  data: string;
  local: string;
  estilo: string;
  orcamento: string;
  objetivo: string;
}

export function useUserEvents() {
  const { user, isConfigured } = useAuth();
  const [events, setEvents] = useState<VivaEvent[]>(
    isConfigured ? [] : mockEvents
  );
  const [loading, setLoading] = useState(isConfigured);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega eventos do usuário
  useEffect(() => {
    if (!isConfigured || !user) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from('user_events')
      .select(`
        id, title, event_type, event_date, location,
        desired_style, budget, emotional_goal, notes, created_at,
        event_plans (
          look_suggestion, beauty_suggestion, checklist,
          routine, recommended_items, motivational_message
        )
      `)
      .eq('user_id', user.id)
      .order('event_date', { ascending: true })
      .then(({ data, error: err }) => {
        if (err) {
          safeError('useUserEvents: load error', err);
          setError('Não foi possível carregar os eventos.');
          setEvents(mockEvents);
        } else {
          safeLog('useUserEvents: loaded', data?.length ?? 0);
          setEvents(
            (data ?? []).map((row) => {
              const planRaw = row.event_plans?.[0];
              const plan: EventPlan | undefined = planRaw
                ? {
                    lookSuggestion: planRaw.look_suggestion ?? '',
                    checklist: (planRaw.checklist as string[]) ?? [],
                    routine: (planRaw.routine as EventPlan['routine']) ?? [],
                    recommendedItems:
                      (planRaw.recommended_items as EventPlan['recommendedItems']) ?? [],
                    motivationalMessage: planRaw.motivational_message ?? '',
                  }
                : undefined;

              return {
                id: row.id,
                title: row.title,
                type: (row.event_type as EventType) ?? 'Outro',
                date: row.event_date ?? '',
                location: row.location ?? '',
                style: row.desired_style ?? '',
                budget: row.budget ?? 0,
                emotionalGoal: row.emotional_goal ?? '',
                plan,
              };
            })
          );
        }
        setLoading(false);
      });
  }, [isConfigured, user]);

  const createEvent = useCallback(
    async (input: NewEventInput): Promise<VivaEvent | null> => {
      setCreating(true);
      setError(null);

      const plan = generateMockPlan(input.titulo, input.estilo, input.objetivo);

      if (!isConfigured || !user) {
        // Fallback: apenas adiciona na memória
        const newEvent: VivaEvent = {
          id: `e-local-${Date.now()}`,
          title: input.titulo,
          type: input.tipo,
          date: input.data,
          location: input.local,
          style: input.estilo,
          budget: Number(input.orcamento) || 0,
          emotionalGoal: input.objetivo,
          plan,
        };
        setEvents((prev) => [newEvent, ...prev]);
        setCreating(false);
        return newEvent;
      }

      const supabase = createClient();

      // 1. Salvar evento
      const { data: eventData, error: eventErr } = await supabase
        .from('user_events')
        .insert({
          user_id: user.id,
          title: input.titulo,
          event_type: input.tipo,
          event_date: input.data || null,
          location: input.local,
          desired_style: input.estilo,
          budget: Number(input.orcamento) || null,
          emotional_goal: input.objetivo,
        })
        .select('id')
        .single();

      if (eventErr || !eventData) {
        safeError('useUserEvents: create event error', eventErr);
        setError('Não foi possível criar o evento. Tente novamente.');
        setCreating(false);
        return null;
      }

      // 2. Salvar plano mockado
      await supabase.from('event_plans').insert({
        user_id: user.id,
        event_id: eventData.id,
        look_suggestion: plan.lookSuggestion,
        checklist: plan.checklist,
        routine: plan.routine,
        recommended_items: plan.recommendedItems,
        motivational_message: plan.motivationalMessage,
      });

      safeLog('useUserEvents: event created');

      const newEvent: VivaEvent = {
        id: eventData.id,
        title: input.titulo,
        type: input.tipo,
        date: input.data,
        location: input.local,
        style: input.estilo,
        budget: Number(input.orcamento) || 0,
        emotionalGoal: input.objetivo,
        plan,
      };

      setEvents((prev) => [newEvent, ...prev]);
      setCreating(false);
      return newEvent;
    },
    [isConfigured, user]
  );

  return { events, loading, creating, error, createEvent };
}
