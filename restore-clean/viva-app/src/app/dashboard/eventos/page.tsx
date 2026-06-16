'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarHeart,
  Plus,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Circle,
  ShoppingBag,
  X,
  Loader2,
} from 'lucide-react';
import { mockEvents } from '@/data/mock';
import { formatDate, formatPrice } from '@/lib/utils';
import type { VivaEvent, EventPlan, EventType } from '@/types';

const eventTypes: EventType[] = [
  'Show',
  'Festival',
  'Balada',
  'Formatura',
  'Jantar',
  'Casamento',
  'Encontro',
  'Viagem',
  'Outro',
];

const eventTypeEmoji: Record<EventType, string> = {
  Show: '🎤',
  Festival: '🎵',
  Balada: '💃',
  Formatura: '🎓',
  Jantar: '🕯️',
  Casamento: '💒',
  Encontro: '💕',
  Viagem: '✈️',
  Outro: '🎉',
};

function generateMockPlan(titulo: string, estilo: string, objetivo: string): EventPlan {
  return {
    lookSuggestion: `Para "${titulo}", sugerimos um visual ${estilo.toLowerCase() || 'elegante e moderno'}. Aposte em peças que transmitam ${objetivo.toLowerCase() || 'confiança e autenticidade'}. Complemente com acessórios que destaquem sua personalidade — brincos statement, bolsa clutch e um perfume marcante.`,
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
      { name: 'Spray Fixador de Maquiagem', price: 45.90, link: '#' },
      { name: 'Hidratante Corporal Premium', price: 59.90, link: '#' },
      { name: 'Gloss Labial Volumizador', price: 34.90, link: '#' },
      { name: 'Perfume Floral Intenso', price: 129.90, link: '#' },
    ],
    motivationalMessage: `Você merece brilhar em cada momento! ✨ Lembre-se: a preparação faz parte da diversão. Quando o dia chegar, você vai estar radiante e pronta pra viver tudo com intensidade. 💜`,
  };
}

export default function EventosPage() {
  const [events, setEvents] = useState<VivaEvent[]>(mockEvents);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    tipo: 'Show' as EventType,
    titulo: '',
    data: '',
    local: '',
    estilo: '',
    orcamento: '',
    objetivo: '',
  });

  const toggleExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newEvent: VivaEvent = {
      id: `e${Date.now()}`,
      title: formData.titulo,
      type: formData.tipo,
      date: formData.data,
      location: formData.local,
      style: formData.estilo,
      budget: Number(formData.orcamento) || 300,
      emotionalGoal: formData.objetivo,
      plan: generateMockPlan(formData.titulo, formData.estilo, formData.objetivo),
    };

    setEvents([newEvent, ...events]);
    setExpandedEvent(newEvent.id);
    setIsGenerating(false);
    setShowForm(false);
    setFormData({
      tipo: 'Show',
      titulo: '',
      data: '',
      local: '',
      estilo: '',
      orcamento: '',
      objetivo: '',
    });
  };

  return (
    <div className="min-h-screen bg-viva-light pb-24">
      {/* Header */}
      <div className="gradient-bg px-4 pt-8 pb-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <CalendarHeart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Modo Evento</h1>
                <p className="text-sm text-white/80">Prepare-se para cada momento especial</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? 'Fechar' : 'Criar novo evento'}
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 -mt-5">
        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-2xl p-6 shadow-premium mb-6">
                <div className="mb-5 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-viva-purple" />
                  <h2 className="text-lg font-bold text-viva-graphite">Criar Preparação com IA</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Tipo */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-viva-graphite">
                        Tipo do evento
                      </label>
                      <select
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value as EventType })}
                        className="w-full rounded-xl border border-viva-border bg-white px-4 py-2.5 text-sm text-viva-graphite outline-none transition-colors focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/20"
                      >
                        {eventTypes.map((type) => (
                          <option key={type} value={type}>
                            {eventTypeEmoji[type]} {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Título */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-viva-graphite">
                        Título
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        placeholder="Ex: Show da Anitta"
                        className="w-full rounded-xl border border-viva-border bg-white px-4 py-2.5 text-sm text-viva-graphite outline-none transition-colors placeholder:text-viva-gray focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/20"
                      />
                    </div>

                    {/* Data */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-viva-graphite">
                        Data
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.data}
                        onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                        className="w-full rounded-xl border border-viva-border bg-white px-4 py-2.5 text-sm text-viva-graphite outline-none transition-colors focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/20"
                      />
                    </div>

                    {/* Local */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-viva-graphite">
                        Local
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.local}
                        onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                        placeholder="Ex: Allianz Parque, SP"
                        className="w-full rounded-xl border border-viva-border bg-white px-4 py-2.5 text-sm text-viva-graphite outline-none transition-colors placeholder:text-viva-gray focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/20"
                      />
                    </div>

                    {/* Estilo */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-viva-graphite">
                        Estilo desejado
                      </label>
                      <input
                        type="text"
                        value={formData.estilo}
                        onChange={(e) => setFormData({ ...formData, estilo: e.target.value })}
                        placeholder="Ex: Ousado e moderno"
                        className="w-full rounded-xl border border-viva-border bg-white px-4 py-2.5 text-sm text-viva-graphite outline-none transition-colors placeholder:text-viva-gray focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/20"
                      />
                    </div>

                    {/* Orçamento */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-viva-graphite">
                        Orçamento (R$)
                      </label>
                      <input
                        type="number"
                        value={formData.orcamento}
                        onChange={(e) => setFormData({ ...formData, orcamento: e.target.value })}
                        placeholder="Ex: 500"
                        className="w-full rounded-xl border border-viva-border bg-white px-4 py-2.5 text-sm text-viva-graphite outline-none transition-colors placeholder:text-viva-gray focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/20"
                      />
                    </div>
                  </div>

                  {/* Objetivo emocional */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-viva-graphite">
                      Objetivo emocional
                    </label>
                    <textarea
                      value={formData.objetivo}
                      onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                      placeholder="Como você quer se sentir? Ex: Me sentir poderosa e confiante"
                      rows={3}
                      className="w-full resize-none rounded-xl border border-viva-border bg-white px-4 py-2.5 text-sm text-viva-graphite outline-none transition-colors placeholder:text-viva-gray focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/20"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isGenerating}
                    className="gradient-bg flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-glow transition-opacity disabled:opacity-70"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Gerando plano com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Gerar Plano com IA
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events List */}
        <div className="space-y-4">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl shadow-card overflow-hidden"
            >
              {/* Event Card Header */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-viva-purple/10 text-3xl">
                      {eventTypeEmoji[event.type]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-viva-graphite">{event.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-viva-gray">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-viva-purple/10 px-3 py-0.5 text-xs font-medium text-viva-purple">
                          {event.type}
                        </span>
                        <span className="rounded-full bg-viva-pink-light px-3 py-0.5 text-xs font-medium text-viva-purple-dark">
                          {formatPrice(event.budget)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {event.emotionalGoal && (
                  <p className="mt-3 text-sm italic text-viva-gray">
                    &quot;{event.emotionalGoal}&quot;
                  </p>
                )}

                {/* Expand/Collapse Button */}
                {event.plan && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleExpand(event.id)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-viva-border bg-viva-light px-4 py-2.5 text-sm font-medium text-viva-purple transition-colors hover:bg-viva-purple/5"
                  >
                    {expandedEvent === event.id ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Fechar plano
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Ver plano completo
                      </>
                    )}
                  </motion.button>
                )}

                {!event.plan && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData({
                        tipo: event.type,
                        titulo: event.title,
                        data: event.date,
                        local: event.location,
                        estilo: event.style,
                        orcamento: String(event.budget),
                        objetivo: event.emotionalGoal,
                      });
                      setShowForm(true);
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-viva-purple px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-viva-purple-dark"
                  >
                    <Sparkles className="h-4 w-4" />
                    Gerar plano com IA
                  </motion.button>
                )}
              </div>

              {/* Expanded Plan */}
              <AnimatePresence>
                {expandedEvent === event.id && event.plan && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-viva-border bg-viva-light/50 p-5 space-y-5">
                      {/* Look Suggestion */}
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-viva-graphite mb-2">
                          <Sparkles className="h-4 w-4 text-viva-purple" />
                          Sugestão de Look
                        </h4>
                        <p className="text-sm text-viva-gray leading-relaxed rounded-xl bg-white p-4 border border-viva-border">
                          {event.plan.lookSuggestion}
                        </p>
                      </div>

                      {/* Checklist */}
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-viva-graphite mb-2">
                          <CheckCircle2 className="h-4 w-4 text-viva-success" />
                          Checklist
                        </h4>
                        <div className="space-y-2">
                          {event.plan.checklist.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 rounded-xl bg-white p-3 border border-viva-border text-sm text-viva-graphite"
                            >
                              <Circle className="h-4 w-4 text-viva-gray shrink-0" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Routine */}
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-viva-graphite mb-2">
                          <Calendar className="h-4 w-4 text-viva-lavender" />
                          Rotina de Preparação
                        </h4>
                        <div className="space-y-2">
                          {event.plan.routine.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 rounded-xl bg-white p-3 border border-viva-border"
                            >
                              {item.done ? (
                                <CheckCircle2 className="h-4 w-4 text-viva-success shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-viva-gray shrink-0" />
                              )}
                              <div>
                                <span className="text-xs font-semibold text-viva-purple">{item.day}</span>
                                <p className={`text-sm ${item.done ? 'text-viva-gray line-through' : 'text-viva-graphite'}`}>
                                  {item.task}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Items */}
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-viva-graphite mb-2">
                          <ShoppingBag className="h-4 w-4 text-viva-pink" />
                          Produtos Recomendados
                        </h4>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {event.plan.recommendedItems.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-xl bg-white p-3 border border-viva-border"
                            >
                              <div>
                                <p className="text-sm font-medium text-viva-graphite">{item.name}</p>
                                <p className="text-xs text-viva-gray">🔗 Link afiliado</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-viva-purple">{formatPrice(item.price)}</p>
                                <button
                                  onClick={() => alert('Link de afiliado será adicionado')}
                                  className="text-xs font-medium text-viva-lavender hover:text-viva-purple transition-colors"
                                >
                                  Ver →
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Motivational Message */}
                      <div className="rounded-xl bg-gradient-to-r from-viva-purple/10 to-viva-pink-light p-4">
                        <p className="text-sm font-medium text-viva-graphite text-center">
                          {event.plan.motivationalMessage}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass mt-8 rounded-2xl p-12 text-center shadow-card"
          >
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-lg font-bold text-viva-graphite mb-2">Nenhum evento ainda</h3>
            <p className="text-sm text-viva-gray mb-4">
              Crie seu primeiro evento e deixe a IA preparar tudo pra você!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="gradient-bg rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-glow"
            >
              <Plus className="mr-2 inline h-4 w-4" />
              Criar primeiro evento
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
