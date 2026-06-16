'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  Calendar,
  Ticket,
  Navigation,
  Sparkles,
  Search,
} from 'lucide-react';
import { mockDiscoverEvents } from '@/data/mock';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const filterTabs = ['Todos', 'Shows', 'Festas', 'Festivais', 'Experiências', 'Gratuitos', 'Perto de mim'];

const typeColors: Record<string, string> = {
  Shows: 'bg-purple-100 text-purple-700',
  Festas: 'bg-pink-100 text-pink-700',
  Festivais: 'bg-amber-100 text-amber-700',
  Experiências: 'bg-teal-100 text-teal-700',
  Gratuitos: 'bg-green-100 text-green-700',
};

export default function DescobrirEventosPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    let result = [...mockDiscoverEvents];

    // Filter by type
    if (activeFilter === 'Perto de mim') {
      result = result
        .filter((e) => e.distance)
        .sort((a, b) => {
          const distA = parseFloat(a.distance?.replace('km', '') || '999');
          const distB = parseFloat(b.distance?.replace('km', '') || '999');
          return distA - distB;
        });
    } else if (activeFilter !== 'Todos') {
      result = result.filter((e) => e.type === activeFilter);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.location.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

  const handleCreatePrep = (eventTitle: string) => {
    router.push(`/dashboard/eventos?evento=${encodeURIComponent(eventTitle)}`);
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
              <Compass className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Descobrir Eventos</h1>
              <p className="text-sm text-white/80">Encontre experiências incríveis perto de você</p>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 relative"
          >
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar eventos, locais..."
              className="w-full rounded-xl border-none bg-white/20 backdrop-blur-sm pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/60 outline-none focus:bg-white/30 transition-colors"
            />
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-5">
        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-3 shadow-card mb-6 overflow-x-auto"
        >
          <div className="flex gap-2 min-w-max">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === tab
                    ? 'gradient-bg text-white shadow-glow'
                    : 'text-viva-gray hover:bg-viva-purple/5 hover:text-viva-purple'
                }`}
              >
                {tab === 'Perto de mim' && '📍 '}{tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-viva-gray mb-4"
        >
          <span className="font-semibold text-viva-graphite">{filteredEvents.length}</span>{' '}
          {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
        </motion.p>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl shadow-card overflow-hidden group hover:shadow-premium transition-shadow"
            >
              {/* Image Area */}
              <div className="relative bg-gradient-to-br from-viva-purple/5 to-viva-pink-light p-8 text-center">
                <span className="text-7xl">{event.image}</span>

                {/* Type Badge */}
                <span
                  className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium ${
                    typeColors[event.type] || 'bg-viva-purple/10 text-viva-purple'
                  }`}
                >
                  {event.type}
                </span>

                {/* Price Badge */}
                <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-viva-graphite">
                  {event.price}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-base font-bold text-viva-graphite">{event.title}</h3>

                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-viva-gray">
                    <Calendar className="h-3.5 w-3.5 text-viva-lavender shrink-0" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-viva-gray">
                    <MapPin className="h-3.5 w-3.5 text-viva-lavender shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  {event.distance && (
                    <div className="flex items-center gap-2 text-sm text-viva-gray">
                      <Navigation className="h-3.5 w-3.5 text-viva-lavender shrink-0" />
                      {event.distance} de distância
                    </div>
                  )}
                </div>

                {/* Price tag (mobile-friendly) */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Ticket className="h-4 w-4 text-viva-purple" />
                    <span className="text-sm font-bold text-viva-purple">{event.price}</span>
                  </div>
                </div>

                {/* Action */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCreatePrep(event.title)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-viva-purple px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-viva-purple-dark"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Criar preparação com IA
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass mt-4 rounded-2xl p-12 text-center shadow-card"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-viva-graphite mb-2">
              Nenhum evento encontrado
            </h3>
            <p className="text-sm text-viva-gray mb-4">
              Tente outro filtro ou busca diferente.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveFilter('Todos');
                setSearchQuery('');
              }}
              className="text-sm font-semibold text-viva-purple hover:text-viva-purple-dark"
            >
              Ver todos os eventos
            </motion.button>
          </motion.div>
        )}

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 rounded-2xl bg-gradient-to-r from-viva-purple/5 to-viva-pink-light p-5"
        >
          <div className="flex flex-col items-center text-center gap-3 sm:flex-row sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-viva-purple/10 shrink-0">
              <Sparkles className="h-6 w-6 text-viva-purple" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-viva-graphite">
                Prepare-se com a IA da Viva
              </h4>
              <p className="text-xs text-viva-gray mt-0.5">
                Escolha um evento e crie um plano completo: look, checklist, rotina de preparação e
                sugestões de produtos com desconto. Tudo personalizado pra você! 💜
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
