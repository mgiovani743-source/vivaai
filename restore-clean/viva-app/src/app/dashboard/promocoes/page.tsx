'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  ExternalLink,
  SlidersHorizontal,
  Search,
  Sparkles,
} from 'lucide-react';
import { mockProducts } from '@/data/mock';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

// TODO: Integrar com APIs de afiliados reais (Lomadee, Awin, Amazon Associates)
// TODO: Implementar scraping via worker separado para buscar promoções reais
// TODO: Adicionar tracking de cliques para comissão de afiliados
// TODO: Sistema de aprovação manual de promoções antes de exibir
// TODO: Cache de promoções com TTL para performance

const categories = [
  'Todas',
  'Moda',
  'Beleza',
  'Acessórios',
  'Fitness',
  'Eventos',
  'Autocuidado',
  'Achadinhos da semana',
];

type SortOption = 'recent' | 'discount' | 'price';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'recent', label: 'Recentes' },
  { value: 'discount', label: 'Maior desconto' },
  { value: 'price', label: 'Menor preço' },
];

export default function PromocoesPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFavorite = (productId: string) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (activeCategory !== 'Todas') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.store.toLowerCase().includes(query) ||
          p.tag.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'price':
        result.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [products, activeCategory, sortBy, searchQuery]);

  const getTagColor = (tag: string): string => {
    if (tag.includes('vendido') || tag.includes('Menor preço')) return 'bg-red-100 text-red-700';
    if (tag.includes('Favorito') || tag.includes('Achadinho')) return 'bg-viva-purple/10 text-viva-purple';
    if (tag.includes('Essencial') || tag.includes('treino')) return 'bg-blue-100 text-blue-700';
    if (tag.includes('evento')) return 'bg-amber-100 text-amber-700';
    if (tag.includes('Rotina') || tag.includes('noite')) return 'bg-indigo-100 text-indigo-700';
    if (tag.includes('Verão')) return 'bg-orange-100 text-orange-700';
    return 'bg-viva-pink-light text-viva-purple-dark';
  };

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
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Promoções & Achadinhos</h1>
              <p className="text-sm text-white/80">As melhores ofertas selecionadas pra você</p>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 relative"
          >
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-viva-gray" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar promoções..."
              className="w-full rounded-xl border-none bg-white/20 backdrop-blur-sm pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/60 outline-none focus:bg-white/30 transition-colors"
            />
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-5">
        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-3 shadow-card mb-4 overflow-x-auto"
        >
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'gradient-bg text-white shadow-glow'
                    : 'text-viva-gray hover:bg-viva-purple/5 hover:text-viva-purple'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-4"
        >
          <p className="text-sm text-viva-gray">
            <span className="font-semibold text-viva-graphite">{filteredAndSorted.length}</span>{' '}
            {filteredAndSorted.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-viva-gray" />
            <div className="flex gap-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    sortBy === opt.value
                      ? 'bg-viva-purple text-white'
                      : 'text-viva-gray hover:bg-viva-purple/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSorted.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl shadow-card overflow-hidden group hover:shadow-premium transition-shadow"
            >
              {/* Image Area */}
              <div className="relative bg-gradient-to-br from-viva-purple/5 to-viva-pink-light p-6 text-center">
                <span className="text-6xl">{product.image}</span>

                {/* Discount Badge */}
                <div className="absolute top-3 left-3 rounded-full bg-viva-danger px-2.5 py-1 text-xs font-bold text-white">
                  -{product.discount}%
                </div>

                {/* Favorite Button */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    product.isFavorite
                      ? 'bg-red-50 text-red-500'
                      : 'bg-white/80 text-viva-gray hover:text-red-500'
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${product.isFavorite ? 'fill-current' : ''}`}
                  />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Tag */}
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getTagColor(product.tag)}`}
                >
                  {product.tag}
                </span>

                {/* Product Name */}
                <h3 className="mt-2 text-sm font-bold text-viva-graphite line-clamp-2">
                  {product.name}
                </h3>

                {/* Store */}
                <p className="mt-0.5 text-xs text-viva-gray">{product.store}</p>

                {/* Pricing */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xs text-viva-gray line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-lg font-bold text-viva-purple">
                    {formatPrice(product.currentPrice)}
                  </span>
                </div>

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

        {/* Empty State */}
        {filteredAndSorted.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass mt-4 rounded-2xl p-12 text-center shadow-card"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-viva-graphite mb-2">
              Nenhuma promoção encontrada
            </h3>
            <p className="text-sm text-viva-gray">
              Tente outra categoria ou busca diferente.
            </p>
          </motion.div>
        )}

        {/* Affiliate Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 rounded-2xl bg-gradient-to-r from-viva-purple/5 to-viva-pink-light p-5 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-viva-purple" />
            <p className="text-sm font-semibold text-viva-graphite">
              Promoções selecionadas com carinho
            </p>
          </div>
          <p className="text-xs text-viva-gray">
            Alguns links são afiliados — ao comprar, você apoia a Viva sem pagar nada a mais. 💜
          </p>
        </motion.div>
      </div>
    </div>
  );
}
