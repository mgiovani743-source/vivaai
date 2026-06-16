'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookHeart, Sparkles, Calendar, Brain, TrendingUp, Heart, Save, Loader2 } from 'lucide-react';
import { useDiary } from '@/hooks/useDiary';
import { formatDate } from '@/lib/utils';
import type { MoodType } from '@/types';

const moods: { type: MoodType; emoji: string; label: string }[] = [
  { type: 'radiante', emoji: '🌟', label: 'Radiante' },
  { type: 'feliz', emoji: '😊', label: 'Feliz' },
  { type: 'neutra', emoji: '😐', label: 'Neutra' },
  { type: 'triste', emoji: '😢', label: 'Triste' },
  { type: 'ansiosa', emoji: '😰', label: 'Ansiosa' },
  { type: 'irritada', emoji: '😤', label: 'Irritada' },
  { type: 'cansada', emoji: '😴', label: 'Cansada' },
];

const moodEmoji: Record<MoodType, string> = {
  radiante: '🌟',
  feliz: '😊',
  neutra: '😐',
  triste: '😢',
  ansiosa: '😰',
  irritada: '😤',
  cansada: '😴',
};

export default function DiarioPage() {
  const { entries, loading, saving, error, addEntry } = useDiary();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!selectedMood || !content.trim()) return;
    const ok = await addEntry(selectedMood, content);
    if (ok) {
      setSelectedMood(null);
      setContent('');
    }
  };

  return (
    <div className="min-h-screen bg-viva-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center">
            <BookHeart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-viva-graphite">
              Diário Emocional
            </h1>
            <p className="text-viva-gray text-sm">
              Registre como você está se sentindo
            </p>
          </div>
        </motion.div>

        {/* New Entry Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-card space-y-6"
        >
          <h2 className="text-lg font-semibold text-viva-graphite">
            Como você está se sentindo hoje?
          </h2>

          {/* Mood Selector */}
          <div className="flex flex-wrap gap-3">
            {moods.map((mood) => (
              <motion.button
                key={mood.type}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(mood.type)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all cursor-pointer ${
                  selectedMood === mood.type
                    ? 'bg-viva-purple/10 ring-2 ring-viva-purple shadow-glow'
                    : 'bg-viva-light hover:bg-viva-purple/5'
                }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span
                  className={`text-xs font-medium ${
                    selectedMood === mood.type ? 'text-viva-purple' : 'text-viva-gray'
                  }`}
                >
                  {mood.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Text Area */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva sobre seu dia, seus pensamentos, sentimentos..."
              rows={5}
              className="w-full p-4 rounded-2xl border border-viva-border bg-viva-light/50 text-viva-graphite placeholder-viva-gray/50 focus:outline-none focus:ring-2 focus:ring-viva-purple/30 focus:border-viva-purple/50 resize-none transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-viva-danger">{error}</p>
          )}

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!selectedMood || !content.trim() || saving}
            className={`w-full md:w-auto px-8 py-3 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer ${
              !selectedMood || !content.trim() || saving
                ? 'bg-viva-gray/30 cursor-not-allowed'
                : 'gradient-bg hover:shadow-glow'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar registro
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Padrões Emocionais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-viva-graphite mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-viva-purple" />
            Padrões Emocionais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <Heart className="w-5 h-5 text-viva-pink" />,
                title: 'Humor mais frequente',
                value: entries.length > 0
                  ? (() => {
                      const counts: Record<string, number> = {};
                      entries.forEach((e) => { counts[e.mood] = (counts[e.mood] ?? 0) + 1; });
                      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                      return top ? `${top[0].charAt(0).toUpperCase() + top[0].slice(1)} ${moodEmoji[top[0] as MoodType]}` : 'Sem dados';
                    })()
                  : 'Sem dados',
                bg: 'bg-viva-pink-light',
              },
              {
                icon: <Calendar className="w-5 h-5 text-viva-purple" />,
                title: 'Total de registros',
                value: `${entries.length} entradas`,
                bg: 'bg-viva-purple/5',
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-viva-success" />,
                title: 'Reflexão ativa',
                value: 'IA V1 — Local',
                bg: 'bg-green-50',
              },
            ].map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`${pattern.bg} rounded-2xl p-5 space-y-2`}
              >
                <div className="flex items-center gap-2">
                  {pattern.icon}
                  <span className="text-sm font-medium text-viva-gray">
                    {pattern.title}
                  </span>
                </div>
                <p className="text-lg font-bold text-viva-graphite">
                  {pattern.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-viva-graphite mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-viva-purple" />
            Seus Registros
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 text-viva-purple animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl p-5 md:p-6 shadow-card space-y-3"
                  >
                    {/* Entry Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{moodEmoji[entry.mood]}</span>
                        <div>
                          <span className="text-sm font-medium text-viva-graphite capitalize">
                            {entry.mood}
                          </span>
                          <p className="text-xs text-viva-gray">
                            {formatDate(entry.date)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-viva-graphite/80 text-sm leading-relaxed">
                      {entry.content}
                    </p>

                    {/* AI Analysis (mockado local) */}
                    {entry.aiAnalysis && (
                      <div className="bg-viva-purple/5 rounded-xl p-4 border border-viva-purple/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-viva-purple" />
                          <span className="text-xs font-semibold text-viva-purple">
                            Reflexão da Viva AI
                          </span>
                        </div>
                        <p className="text-sm text-viva-graphite/70 leading-relaxed">
                          {entry.aiAnalysis}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {entries.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">📔</p>
                  <p className="text-viva-gray text-sm">
                    Nenhum registro ainda. Como você está se sentindo hoje?
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
