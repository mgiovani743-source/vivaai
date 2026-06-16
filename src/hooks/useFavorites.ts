'use client';

/**
 * VIVA AI — Hook: useFavorites
 *
 * Gerencia favoritos (produtos, looks, eventos) no Supabase.
 * Fallback para dados mockados quando Supabase não está configurado.
 */
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { useAuth } from '@/contexts/AuthContext';
import { mockProducts } from '@/data/mock';
import { safeLog, safeError } from '@/lib/security/privacy';

export interface FavoriteItem {
  id: string;
  item_type: string;
  item_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

type ItemType = 'product' | 'look' | 'event';

export function useFavorites(itemType?: ItemType) {
  const { user, isConfigured } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(isConfigured);
  const [error, setError] = useState<string | null>(null);

  // Inicializa com mockados se não configurado
  useEffect(() => {
    if (!isConfigured) {
      // Favoritos iniciais baseados nos dados mockados
      const mockFavs: FavoriteItem[] = mockProducts
        .filter((p) => p.isFavorite)
        .map((p) => ({
          id: `fav-mock-${p.id}`,
          item_type: 'product',
          item_id: p.id,
          metadata: { name: p.name, store: p.store },
          created_at: new Date().toISOString(),
        }));
      setFavorites(itemType ? mockFavs.filter((f) => f.item_type === itemType) : mockFavs);
      setLoading(false);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    let query = supabase
      .from('favorites')
      .select('id, item_type, item_id, metadata, created_at')
      .eq('user_id', user.id);

    if (itemType) {
      query = query.eq('item_type', itemType);
    }

    query.order('created_at', { ascending: false }).then(({ data, error: err }) => {
      if (err) {
        safeError('useFavorites: load error', err);
        setError('Não foi possível carregar os favoritos.');
      } else {
        safeLog('useFavorites: loaded', data?.length ?? 0);
        setFavorites(
          (data ?? []).map((row) => ({
            id: row.id,
            item_type: row.item_type,
            item_id: row.item_id,
            metadata: (row.metadata as Record<string, unknown>) ?? {},
            created_at: row.created_at,
          }))
        );
      }
      setLoading(false);
    });
  }, [isConfigured, user, itemType]);

  /** Verifica se um item é favorito */
  const isFavorite = useCallback(
    (id: string, type: ItemType = 'product') =>
      favorites.some((f) => f.item_id === id && f.item_type === type),
    [favorites]
  );

  /** Adiciona favorito */
  const addFavorite = useCallback(
    async (itemId: string, type: ItemType, metadata: Record<string, unknown> = {}) => {
      if (!isConfigured || !user) {
        // Fallback: apenas adiciona na memória
        setFavorites((prev) => [
          {
            id: `fav-local-${Date.now()}`,
            item_type: type,
            item_id: itemId,
            metadata,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        return;
      }

      const supabase = createClient();
      const { data, error: err } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, item_type: type, item_id: itemId, metadata })
        .select('id, item_type, item_id, metadata, created_at')
        .single();

      if (err) {
        safeError('useFavorites: add error', err);
        return;
      }
      safeLog('useFavorites: added', type);
      setFavorites((prev) => [
        {
          id: data.id,
          item_type: data.item_type,
          item_id: data.item_id,
          metadata: (data.metadata as Record<string, unknown>) ?? {},
          created_at: data.created_at,
        },
        ...prev,
      ]);
    },
    [isConfigured, user]
  );

  /** Remove favorito */
  const removeFavorite = useCallback(
    async (itemId: string, type: ItemType = 'product') => {
      // Otimista: remove da UI imediatamente
      setFavorites((prev) =>
        prev.filter((f) => !(f.item_id === itemId && f.item_type === type))
      );

      if (!isConfigured || !user) return;

      const supabase = createClient();
      const { error: err } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', type)
        .eq('item_id', itemId);

      if (err) {
        safeError('useFavorites: remove error', err);
        // Reverte em caso de erro
        addFavorite(itemId, type);
      } else {
        safeLog('useFavorites: removed', type);
      }
    },
    [isConfigured, user, addFavorite]
  );

  /** Toggle favorito */
  const toggleFavorite = useCallback(
    async (itemId: string, type: ItemType = 'product', metadata: Record<string, unknown> = {}) => {
      if (isFavorite(itemId, type)) {
        await removeFavorite(itemId, type);
      } else {
        await addFavorite(itemId, type, metadata);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return { favorites, loading, error, isFavorite, addFavorite, removeFavorite, toggleFavorite };
}
