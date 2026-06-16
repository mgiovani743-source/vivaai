'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookHeart, Sparkles, Calendar, Brain, TrendingUp, Heart, Save } from 'lucide-react';
import { mockDiaryEntries } from '@/data/mock';
import { formatDate } from '@/lib/utils';
import type { DiaryEntry, MoodType } from '@/types';

const moods: { type: MoodType; emoji: string; label: string }[] = [
  { type: 'radiante', emoji: '🌟', label: 'Radiante' },
  { type: 'feliz', emoji: '😊', label: 'Feliz' },
  { type: 'neutra', emoji: '😐', label: 'Neutra' },
  { type: 'triste', emoji: '😢', label: 'Triste' },
  { type: 'ansiosa', emoji: '😰', label: 'Ansiosa' },
  { type: 'irritada', emoji: '😤', label: 'Irritada' },
  { type: 'cansada', emoji: '😴', label: 'Cansada' },
];

const mockAIAnalyses = [
  'Que lindo! Percebo que você tem se sentido melhor nos dias que pratica autocuidado. Continue assim! 💜',
  'Obrigada por compartilhar. Seus registros mostram força e autoconhecimento. Cada dia é uma nova oportunidade! 🌸',
  'Notei que sua energia está crescendo ao longo da semana. Seus hábitos estão fazendo diferença! ✨',
  'Sua jornada de evolução é inspiradora. Lembre-se de celebrar cada pequena vitória! 🌟',
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
  const [entries, setEntries] = useState<DiaryEntry[]>(mockDiaryEntries);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!selectedMood || !content.trim()) return;

    setIsSaving(true);

    setTimeout(() => {
      const newEntry: DiaryEntry = {
        id: `d${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        mood: selectedMood,
        content: content.trim(),
        aiAnalysis: mockAIAnalyses[Math.floor(Math.random() * mockAIAnalyses.length)],
      };

      setEntries([newEntry, ...entries]);
      setSelectedMood(null);
      setContent('');
      setIsSaving(false);
    }, 1500);
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
                <span className={`text-xs font-medium ${
                  selectedMood === mood.type ? 'text-viva-purple' : 'text-viva-gray'
                }`}>
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

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!selectedMood || !content.trim() || isSaving}
            className={`w-full md:w-auto px-8 py-3 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer ${
              !selectedMood || !content.trim() || isSaving
                ? 'bg-viva-gray/30 cursor-not-allowed'
                : 'gradient-bg hover:shadow-glow'
            }`}
          >
            {isSaving ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Analisando com IA...
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
                value: 'Feliz 😊',
                bg: 'bg-viva-pink-light',
              },
              {
                icon: <Calendar className="w-5 h-5 text-viva-purple" />,
                title: 'Melhor dia da semana',
                value: 'Terça-feira',
                bg: 'bg-viva-purple/5',
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-viva-success" />,
                title: 'Gatilho positivo',
                value: 'Skincare + Meditação',
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
          <div className="space-y-4">
            <AnimatePresence>
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05 }}
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

                  {/* AI Analysis */}
                  {entry.aiAnalysis && (
                    <div className="bg-viva-purple/5 rounded-xl p-4 border border-viva-purple/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-viva-purple" />
                        <span className="text-xs font-semibold text-viva-purple">
                          Análise da Viva AI
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
