'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { mockProducts } from '@/data/mock';

export default function FavoritosPage() {
  const { favorites, loading, removeFavorite } = useFavorites('product');

  // Mapeia favoritos para exibição (junta com mock se metadata disponível)
  const displayFavorites = favorites.map((fav) => {
    // Tenta encontrar o produto original no mock para exibir dados completos
    const mock = mockProducts.find((p) => p.id === fav.item_id);
    if (mock) return { ...mock, favId: fav.id };

    // Fallback: usa metadata salvo no banco
    return {
      id: fav.item_id,
      favId: fav.id,
      name: (fav.metadata.name as string) ?? 'Produto favorito',
      store: (fav.metadata.store as string) ?? '',
      image: (fav.metadata.image as string) ?? '🛍️',
      currentPrice: (fav.metadata.currentPrice as number) ?? 0,
      originalPrice: 0,
      discount: 0,
      tag: 'Favorito',
      isFavorite: true,
      category: 'Moda' as const,
      link: '#',
      createdAt: fav.created_at,
      isActive: true,
    };
  });

  return (
    <div className="min-h-screen bg-viva-light pb-24">
      {/* Header */}
      <div className="gradient-bg px-4 pt-8 pb-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Meus Favoritos</h1>
              <p className="text-sm text-white/80">
                {loading
                  ? 'Carregando...'
                  : `${displayFavorites.length} ${displayFavorites.length === 1 ? 'item salvo' : 'itens salvos'}`}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-5">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-viva-purple animate-spin" />
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && (
          <AnimatePresence mode="popLayout">
            {displayFavorites.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayFavorites.map((product, index) => (
                  <motion.div
                    key={product.favId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    className="glass rounded-2xl shadow-card overflow-hidden group hover:shadow-premium transition-shadow"
                  >
                    {/* Image Area */}
                    <div className="relative bg-gradient-to-br from-viva-purple/5 to-viva-pink-light p-6 text-center">
                      <span className="text-6xl">{product.image}</span>

                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <div className="absolute top-3 left-3 rounded-full bg-viva-danger px-2.5 py-1 text-xs font-bold text-white">
                          -{product.discount}%
                        </div>
                      )}

                      {/* Remove Favorite Button */}
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => removeFavorite(product.id, 'product')}
                        className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </motion.button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Tag */}
                      <span className="inline-block rounded-full bg-viva-purple/10 px-2.5 py-0.5 text-xs font-medium text-viva-purple">
                        {product.tag}
                      </span>

                      {/* Product Name */}
                      <h3 className="mt-2 text-sm font-bold text-viva-graphite line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Store */}
                      <p className="mt-0.5 text-xs text-viva-gray">{product.store}</p>

                      {/* Pricing */}
                      {product.currentPrice > 0 && (
                        <div className="mt-3 flex items-baseline gap-2">
                          {product.originalPrice > 0 && (
                            <span className="text-xs text-viva-gray line-through">
                              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                            </span>
                          )}
                          <span className="text-lg font-bold text-viva-purple">
                            R$ {product.currentPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-3 space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => alert('Link de afiliado será adicionado')}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-viva-purple px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-viva-purple-dark"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Ver promoção
                        </motion.button>
                        <p className="text-center text-[10px] text-viva-gray">
                          🔗 Link afiliado
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-12 text-center shadow-card"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-viva-pink-light">
                  <Heart className="h-10 w-10 text-viva-purple" />
                </div>
                <h3 className="text-xl font-bold text-viva-graphite mb-2">
                  Nenhum favorito ainda
                </h3>
                <p className="text-sm text-viva-gray mb-6 max-w-md mx-auto">
                  Explore nossas promoções e toque no coração ❤️ para salvar os produtos
                  que você mais amou. Eles aparecerão aqui!
                </p>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/dashboard/promocoes"
                  className="inline-flex items-center gap-2 gradient-bg rounded-xl px-6 py-3 text-sm font-bold text-white shadow-glow"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Ver promoções
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Tip Banner */}
        {!loading && displayFavorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 rounded-2xl bg-gradient-to-r from-viva-purple/5 to-viva-pink-light p-5 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-viva-purple" />
              <p className="text-sm font-semibold text-viva-graphite">Dica da Viva</p>
            </div>
            <p className="text-xs text-viva-gray">
              Acompanhe seus favoritos — avisamos quando o preço cair ainda mais! 💜
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
