'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Flame, Zap, Award, CheckCircle2, Circle, Star } from 'lucide-react';
import { mockHabits, mockUser } from '@/data/mock';
import type { Habit } from '@/types';

const badges = [
  { id: 'b1', name: '7 dias seguidos', emoji: '🔥', description: 'Complete hábitos por 7 dias', unlocked: true },
  { id: 'b2', name: 'Skincare master', emoji: '✨', description: 'Skincare por 10 dias', unlocked: true },
  { id: 'b3', name: 'Mente zen', emoji: '🧘', description: 'Medite por 5 dias seguidos', unlocked: true },
  { id: 'b4', name: 'Hidratação top', emoji: '💧', description: 'Beba 2L por 14 dias', unlocked: false },
  { id: 'b5', name: 'Atleta Viva', emoji: '🏃‍♀️', description: 'Exercite-se por 21 dias', unlocked: false },
];

const categoryColors: Record<string, string> = {
  Mente: 'bg-viva-purple/10 text-viva-purple',
  Beleza: 'bg-viva-pink-light text-pink-600',
  Saúde: 'bg-green-50 text-green-600',
};

export default function HabitosPage() {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [baseXp] = useState(mockUser.xp);

  const completedCount = useMemo(() => habits.filter((h) => h.completed).length, [habits]);
  const totalCount = habits.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const earnedXp = useMemo(
    () => habits.filter((h) => h.completed).reduce((sum, h) => sum + h.xp, 0),
    [habits]
  );
  const totalXp = baseXp + earnedXp;

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
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
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-viva-graphite">
              Meus Hábitos
            </h1>
            <p className="text-viva-gray text-sm">
              Construa sua melhor versão, um dia de cada vez
            </p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {/* Daily Progress */}
          <div className="bg-white rounded-2xl p-5 shadow-card col-span-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-viva-gray">
                Progresso de Hoje
              </span>
              <span className="text-sm font-bold text-viva-purple">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="w-full h-3 bg-viva-light rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8 }}
                className="h-full gradient-bg rounded-full"
              />
            </div>
            <p className="text-xs text-viva-gray mt-2">
              {progressPercent === 100
                ? '🎉 Todos os hábitos completos! Parabéns!'
                : `Faltam ${totalCount - completedCount} hábitos para completar o dia`}
            </p>
          </div>

          {/* XP */}
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-viva-warning" />
              <span className="text-xs font-medium text-viva-gray">XP Total</span>
            </div>
            <p className="text-2xl font-bold text-viva-graphite">
              {totalXp.toLocaleString()}
            </p>
            <p className="text-xs text-viva-success font-medium">
              +{earnedXp} hoje
            </p>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-viva-gray">Streak</span>
            </div>
            <p className="text-2xl font-bold text-viva-graphite">
              {mockUser.streak} dias
            </p>
            <p className="text-xs text-orange-500 font-medium">🔥 Sequência ativa</p>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-viva-graphite mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-viva-purple" />
            Suas Conquistas
          </h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl border min-w-[110px] ${
                  badge.unlocked
                    ? 'bg-white border-viva-purple/20 shadow-card'
                    : 'bg-viva-light border-viva-border opacity-50'
                }`}
              >
                <span className="text-3xl">{badge.emoji}</span>
                <span className="text-xs font-semibold text-viva-graphite text-center">
                  {badge.name}
                </span>
                {badge.unlocked && (
                  <span className="text-[10px] bg-viva-success/10 text-viva-success font-semibold px-2 py-0.5 rounded-full">
                    Conquistado
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Habits List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-viva-graphite mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-viva-purple" />
            Hábitos do Dia
          </h2>
          <div className="space-y-3">
            {habits.map((habit, i) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`bg-white rounded-2xl p-4 md:p-5 shadow-card flex items-center gap-4 transition-all ${
                  habit.completed ? 'ring-1 ring-viva-success/30' : ''
                }`}
              >
                {/* Checkbox */}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => toggleHabit(habit.id)}
                  className="flex-shrink-0 cursor-pointer"
                >
                  {habit.completed ? (
                    <CheckCircle2 className="w-7 h-7 text-viva-success" />
                  ) : (
                    <Circle className="w-7 h-7 text-viva-border hover:text-viva-purple transition-colors" />
                  )}
                </motion.button>

                {/* Icon & Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{habit.icon}</span>
                    <span
                      className={`font-medium ${
                        habit.completed
                          ? 'text-viva-gray line-through'
                          : 'text-viva-graphite'
                      }`}
                    >
                      {habit.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        categoryColors[habit.category] || 'bg-viva-light text-viva-gray'
                      }`}
                    >
                      {habit.category}
                    </span>
                  </div>
                </div>

                {/* Streak & XP */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-medium text-orange-500 hidden sm:inline">
                    🔥 {habit.streak} dias
                  </span>
                  <span className="text-xs font-bold text-viva-purple bg-viva-purple/10 px-2.5 py-1 rounded-full">
                    +{habit.xp} XP
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
