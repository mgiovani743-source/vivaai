'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Heart,
  ShoppingBag,
  Wand2,
  Loader2,
  X,
} from 'lucide-react';
import { mockLooks } from '@/data/mock';
import type { Look, LookCategory } from '@/types';
import { useRouter } from 'next/navigation';

const lookCategories = ['Todos', 'Show', 'Festival', 'Balada', 'Formatura', 'Jantar', 'Casual', 'Academia'];

const categoryEmoji: Record<string, string> = {
  Show: '🎤',
  Festival: '🌻',
  Balada: '💃',
  Formatura: '🎓',
  Jantar: '🕯️',
  Casual: '☕',
  Academia: '💪',
};

const categoryColors: Record<string, string> = {
  Show: 'bg-purple-100 text-purple-700',
  Festival: 'bg-amber-100 text-amber-700',
  Balada: 'bg-pink-100 text-pink-700',
  Formatura: 'bg-blue-100 text-blue-700',
  Jantar: 'bg-red-100 text-red-700',
  Casual: 'bg-green-100 text-green-700',
  Academia: 'bg-orange-100 text-orange-700',
};

interface AILookSuggestion {
  title: string;
  items: string[];
  tips: string;
  estimatedCost: string;
}

export default function LooksPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [showAIForm, setShowAIForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState<AILookSuggestion | null>(null);

  // AI form state
  const [aiForm, setAIForm] = useState({
    occasion: 'Show' as LookCategory,
    style: '',
    budget: '',
  });

  const filteredLooks = useMemo(() => {
    if (activeCategory === 'Todos') return mockLooks;
    return mockLooks.filter((look) => look.category === activeCategory);
  }, [activeCategory]);

  const handleUseAsInspiration = (look: Look) => {
    alert(`✨ Look "${look.title}" salvo como inspiração!\n\nItens:\n${look.items.map((i) => `• ${i}`).join('\n')}\n\nEm breve você poderá compartilhar e editar seus looks favoritos!`);
  };

  const handleFindPromos = () => {
    router.push('/dashboard/promocoes');
  };

  const handleGenerateAILook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 1800));

    const mockSuggestions: Record<string, AILookSuggestion> = {
      Show: {
        title: 'Look Show Vibrante',
        items: [
          'Top cropped com brilho (R$ 79,90)',
          'Calça cargo preta (R$ 129,90)',
          'Bota plataforma (R$ 199,90)',
          'Argolas douradas grandes (R$ 39,90)',
          'Pochete estilosa (R$ 59,90)',
          'Glitter corporal biodegradável (R$ 25,90)',
        ],
        tips: 'Aposte em brilho e conforto! Use roupas que permitam dançar à vontade. Capriche no glitter e no batom marcante. Leve um casaco leve na pochete pro final do show.',
        estimatedCost: 'R$ 535,40',
      },
      Festival: {
        title: 'Look Festival Boho',
        items: [
          'Kimono estampado (R$ 89,90)',
          'Body básico preto (R$ 49,90)',
          'Short jeans destroyed (R$ 79,90)',
          'Bota country caramelo (R$ 169,90)',
          'Óculos redondo espelhado (R$ 59,90)',
          'Chapéu bucket (R$ 45,90)',
        ],
        tips: 'Festival pede conforto e estilo! Camadas são essenciais para mudanças de temperatura. Use protetor solar e leve uma garrafinha. O bucket hat protege e dá charme!',
        estimatedCost: 'R$ 495,40',
      },
      Balada: {
        title: 'Look Balada Glam',
        items: [
          'Vestido midi com fenda (R$ 159,90)',
          'Sandália tiras finas (R$ 139,90)',
          'Clutch metalizada (R$ 69,90)',
          'Brinco statement (R$ 49,90)',
          'Perfume marcante (R$ 129,90)',
        ],
        tips: 'Menos é mais na balada! Um vestido midi com fenda é elegante e poderoso. Brinco statement dispensa colar. Capriche no perfume e na make — batom vermelho é coringa!',
        estimatedCost: 'R$ 549,50',
      },
      Formatura: {
        title: 'Look Formatura Sofisticado',
        items: [
          'Vestido longo elegante (R$ 289,90)',
          'Sandália dourada (R$ 159,90)',
          'Clutch perolada (R$ 89,90)',
          'Colar delicado (R$ 59,90)',
          'Perfume sofisticado (R$ 149,90)',
        ],
        tips: 'Formatura pede sofisticação! Cores como azul, vinho e nude são elegantes. Aposte em tecidos fluidos e acessórios delicados. Cabelo preso valoriza o colar e os brincos.',
        estimatedCost: 'R$ 749,50',
      },
      Jantar: {
        title: 'Look Jantar Chique',
        items: [
          'Blazer oversized (R$ 199,90)',
          'Calça alfaiataria (R$ 149,90)',
          'Scarpin nude (R$ 139,90)',
          'Bolsa estruturada (R$ 119,90)',
          'Brinco pérola (R$ 39,90)',
        ],
        tips: 'Alfaiataria é sinônimo de elegância! O blazer oversized traz modernidade. Scarpin nude alonga a silhueta. Uma maquiagem clean com destaque nos lábios fecha o look perfeito.',
        estimatedCost: 'R$ 649,50',
      },
      Casual: {
        title: 'Look Casual Estiloso',
        items: [
          'Camisa branca oversized (R$ 89,90)',
          'Calça wide leg jeans (R$ 129,90)',
          'Tênis branco clean (R$ 199,90)',
          'Bolsa tote caramelo (R$ 99,90)',
          'Óculos de sol (R$ 69,90)',
        ],
        tips: 'O casual chique é sobre peças básicas de qualidade! A camisa branca é curinga. Calça wide leg alonga e é super confortável. Tênis branco vai com tudo!',
        estimatedCost: 'R$ 589,50',
      },
      Academia: {
        title: 'Look Academia Power',
        items: [
          'Top esportivo high support (R$ 89,90)',
          'Legging compressão (R$ 119,90)',
          'Tênis performance (R$ 249,90)',
          'Pochete esportiva (R$ 39,90)',
          'Garrafa térmica (R$ 49,90)',
        ],
        tips: 'Performance e estilo! Invista em peças com boa compressão e tecido respirável. O tênis certo faz toda diferença no treino. Combine cores e se sinta poderosa!',
        estimatedCost: 'R$ 549,50',
      },
    };

    setAISuggestion(mockSuggestions[aiForm.occasion] || mockSuggestions['Casual']);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-viva-light pb-24">
      {/* Header */}
      <div className="gradient-bg px-4 pt-8 pb-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Looks & Inspiração</h1>
                <p className="text-sm text-white/80">Encontre o visual perfeito pra cada ocasião</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowAIForm(!showAIForm);
                if (showAIForm) setAISuggestion(null);
              }}
              className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              {showAIForm ? <X className="h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
              {showAIForm ? 'Fechar' : 'Montar com IA'}
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-5">
        {/* AI Look Builder */}
        <AnimatePresence>
          {showAIForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-2xl p-6 shadow-premium mb-6">
                <div className="mb-5 flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-viva-purple" />
                  <h2 className="text-lg font-bold text-viva-graphite">Monte seu Look com IA</h2>
                </div>

                <form onSubmit={handleGenerateAILook} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Occasion */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-viva-graphite">
                        Ocasião
                      </label>
                      <select
                        value={aiForm.occasion}
                        onChange={(e) => setAIForm({ ...aiForm, occasion: e.target.value as LookCategory })}
                        className="w-full rounded-xl border border-viva-border bg-white px-4 py-2.5 text-sm text-viva-graphite outline-none focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/20"
                      >
                        {lookCategories.filter((c) => c !== 'Todos').map((cat) => (
                          <option key={cat} value={cat}>
                            {categoryEmoji[cat] || '✨'} {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Style */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-viva-graphite">
                        Preferência de estilo
                      </label>
                      <input
                        type="text"
                        value={aiForm.style}
                        onChange={(e) => setAIForm({ ...aiForm, style: e.target.value })}
                        placeholder="Ex: Minimalista, ousado..."
                        className="w-full rounded-xl border border-viva-border bg-white px-4 py-2.5 text-sm text-viva-graphite outline-none placeholder:text-viva-gray focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/20"
                      />
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-viva-graphite">
                        Orçamento (R$)
                      </label>
                      <input
                        type="number"
                        value={aiForm.budget}
                        onChange={(e) => setAIForm({ ...aiForm, budget: e.target.value })}
                        placeholder="Ex: 500"
                        className="w-full rounded-xl border border-viva-border bg-white px-4 py-2.5 text-sm text-viva-graphite outline-none placeholder:text-viva-gray focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/20"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isGenerating}
                    className="gradient-bg flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-glow disabled:opacity-70"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        A IA está montando seu look...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Gerar sugestão com IA
                      </>
                    )}
                  </motion.button>
                </form>

                {/* AI Suggestion Card */}
                <AnimatePresence>
                  {aiSuggestion && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 rounded-xl border border-viva-purple/20 bg-gradient-to-br from-viva-purple/5 to-viva-pink-light p-5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-viva-purple" />
                        <h3 className="text-base font-bold text-viva-graphite">
                          {aiSuggestion.title}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-viva-graphite mb-2">Peças sugeridas:</h4>
                          <ul className="space-y-1.5">
                            {aiSuggestion.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-viva-gray">
                                <span className="text-viva-purple mt-0.5">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-lg bg-white/60 p-3">
                          <h4 className="text-sm font-semibold text-viva-graphite mb-1">💡 Dicas:</h4>
                          <p className="text-sm text-viva-gray leading-relaxed">{aiSuggestion.tips}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-viva-gray">
                            Custo estimado: <strong className="text-viva-purple">{aiSuggestion.estimatedCost}</strong>
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleFindPromos}
                            className="flex items-center gap-2 rounded-lg bg-viva-purple px-4 py-2 text-xs font-semibold text-white"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Encontrar promoções
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-3 shadow-card mb-6 overflow-x-auto"
        >
          <div className="flex gap-2 min-w-max">
            {lookCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'gradient-bg text-white shadow-glow'
                    : 'text-viva-gray hover:bg-viva-purple/5 hover:text-viva-purple'
                }`}
              >
                {cat !== 'Todos' && `${categoryEmoji[cat] || ''} `}{cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Looks Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredLooks.map((look, index) => (
            <motion.div
              key={look.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl shadow-card overflow-hidden group hover:shadow-premium transition-shadow"
            >
              {/* Image Area */}
              <div className="relative bg-gradient-to-br from-viva-purple/5 to-viva-pink-light p-8 text-center">
                <span className="text-7xl">{look.image}</span>

                {/* Category Badge */}
                <span
                  className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium ${
                    categoryColors[look.category] || 'bg-viva-purple/10 text-viva-purple'
                  }`}
                >
                  {look.category}
                </span>

                {/* Likes */}
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-sm px-2.5 py-1">
                  <Heart className="h-3 w-3 text-red-500 fill-current" />
                  <span className="text-xs font-medium text-viva-graphite">{look.likes}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-base font-bold text-viva-graphite">{look.title}</h3>

                {/* Items */}
                <ul className="mt-2 space-y-1">
                  {look.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-viva-gray">
                      <span className="text-viva-purple text-xs mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="mt-4 space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUseAsInspiration(look)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-viva-purple px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-viva-purple-dark"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Usar como inspiração
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFindPromos}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-viva-border px-4 py-2 text-sm font-medium text-viva-purple transition-colors hover:bg-viva-purple/5"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Encontrar promoções parecidas
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass mt-4 rounded-2xl p-12 text-center shadow-card"
          >
            <div className="text-5xl mb-4">👗</div>
            <h3 className="text-lg font-bold text-viva-graphite mb-2">
              Nenhum look nessa categoria
            </h3>
            <p className="text-sm text-viva-gray">
              Tente outra categoria ou use a IA para gerar sugestões personalizadas!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
