'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarHeart,
  Users,
  MapPin,
  Clock,
  Trophy,
  Flame,
  ChevronRight,
  Check,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import {
  mockUser,
  mockEvents,
  mockDailyChecklist,
  mockProducts,
  mockChallenges,
  mockInspiration,
} from '@/data/mock';
import { formatPrice, formatDate } from '@/lib/utils';

// ── Progress Ring Component ───────────────────
function ProgressRing({
  score,
  size = 120,
  strokeWidth = 8,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-viva-border"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="progress-ring-circle"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6D5DFC" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#F8BBD0" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-viva-graphite">{score}</span>
        <span className="text-[10px] text-viva-gray font-medium">de 100</span>
      </div>
    </div>
  );
}

// ── Quick Access Item ─────────────────────────
const quickAccessItems = [
  {
    emoji: '🎉',
    title: 'Modo Evento',
    description: 'Planeje seus eventos',
    href: '/dashboard/eventos',
    color: 'bg-purple-50',
  },
  {
    emoji: '🛍️',
    title: 'Promoções',
    description: 'Achadinhos pra você',
    href: '/dashboard/promocoes',
    color: 'bg-pink-50',
  },
  {
    emoji: '✨',
    title: 'Looks',
    description: 'Inspirações de looks',
    href: '/dashboard/looks',
    color: 'bg-violet-50',
  },
  {
    emoji: '📔',
    title: 'Diário',
    description: 'Como você está hoje?',
    href: '/dashboard/diario',
    color: 'bg-rose-50',
  },
  {
    emoji: '👥',
    title: 'Comunidade',
    description: 'Conecte-se com outras',
    href: '/dashboard/comunidade',
    color: 'bg-indigo-50',
  },
  {
    emoji: '💬',
    title: 'Chat Viva AI',
    description: 'Converse com a IA',
    href: '/dashboard/chat',
    color: 'bg-fuchsia-50',
  },
];

// ── Animation variants ────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function DashboardPage() {
  const [checklist, setChecklist] = useState(
    mockDailyChecklist.map((item) => ({ ...item }))
  );

  const toggleCheckItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const nextEvent = mockEvents[0];
  const weekChallenge = mockChallenges[0];
  const completedTasks = checklist.filter((c) => c.done).length;

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {/* ── Evolution Score ────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="bg-white rounded-2xl border border-viva-border p-5 shadow-premium hover:shadow-card transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-viva-graphite">
                Score de Evolução
              </h2>
              <p className="text-xs text-viva-gray mt-0.5">
                Seu progresso geral
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-viva-success/10">
              <Flame className="w-3.5 h-3.5 text-viva-success" />
              <span className="text-xs font-semibold text-viva-success">
                +5 esta semana
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <ProgressRing score={mockUser.evolutionScore} />
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-viva-border">
            <div className="text-center">
              <p className="text-lg font-bold text-viva-graphite">
                {mockUser.xp}
              </p>
              <p className="text-[10px] text-viva-gray">XP Total</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-viva-graphite">
                {mockUser.level}
              </p>
              <p className="text-[10px] text-viva-gray">Nível</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-viva-graphite">
                {mockUser.streak}🔥
              </p>
              <p className="text-[10px] text-viva-gray">Sequência</p>
            </div>
          </div>
        </motion.div>

        {/* ── Próximo Evento ─────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="bg-white rounded-2xl border border-viva-border p-5 shadow-premium hover:shadow-card transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-viva-graphite">
              Próximo Evento
            </h2>
            <Link
              href="/dashboard/eventos"
              className="text-xs text-viva-purple font-medium hover:underline flex items-center gap-1"
            >
              Ver todos
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {nextEvent && (
            <Link
              href="/dashboard/eventos"
              className="block p-4 rounded-xl gradient-bg text-white group hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <CalendarHeart className="w-4 h-4" />
                <span className="text-xs font-medium opacity-90">
                  {nextEvent.type}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">{nextEvent.title}</h3>
              <div className="flex items-center gap-3 text-xs opacity-90">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(nextEvent.date)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {nextEvent.location.split(',')[0]}
                </span>
              </div>
              {nextEvent.emotionalGoal && (
                <p className="mt-3 text-xs italic opacity-80">
                  &quot;{nextEvent.emotionalGoal}&quot;
                </p>
              )}
            </Link>
          )}

          {nextEvent?.plan && (
            <div className="mt-3">
              <p className="text-xs text-viva-gray mb-2">Preparação:</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {nextEvent.plan.routine.map((item, idx) => (
                  <span
                    key={idx}
                    className={`flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full font-medium ${
                      item.done
                        ? 'bg-viva-success/10 text-viva-success'
                        : 'bg-viva-light text-viva-gray'
                    }`}
                  >
                    {item.done ? '✓ ' : ''}
                    {item.day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Daily Checklist ────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="bg-white rounded-2xl border border-viva-border p-5 shadow-premium hover:shadow-card transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-viva-graphite">
                Checklist do Dia
              </h2>
              <p className="text-xs text-viva-gray mt-0.5">
                {completedTasks}/{checklist.length} concluídos
              </p>
            </div>
            {/* Mini progress bar */}
            <div className="w-16 h-2 rounded-full bg-viva-border overflow-hidden">
              <div
                className="h-full rounded-full gradient-bg transition-all duration-500"
                style={{
                  width: `${(completedTasks / checklist.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <ul className="space-y-2">
            {checklist.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => toggleCheckItem(item.id)}
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-viva-light transition-colors text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      item.done
                        ? 'bg-viva-purple border-viva-purple'
                        : 'border-viva-border'
                    }`}
                  >
                    {item.done && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span
                    className={`text-sm transition-all duration-200 ${
                      item.done
                        ? 'line-through text-viva-gray'
                        : 'text-viva-graphite font-medium'
                    }`}
                  >
                    {item.task}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── Achadinhos ────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="md:col-span-2 xl:col-span-3 bg-white rounded-2xl border border-viva-border p-5 shadow-premium"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-viva-graphite">
                Achadinhos escolhidos para você
              </h2>
              <p className="text-xs text-viva-gray mt-0.5">
                Ofertas que combinam com seu estilo
              </p>
            </div>
            <Link
              href="/dashboard/promocoes"
              className="text-xs text-viva-purple font-medium hover:underline flex items-center gap-1"
            >
              Ver mais
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {mockProducts.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href="/dashboard/promocoes"
                className="flex-shrink-0 w-44 sm:w-52 rounded-xl border border-viva-border p-3 hover:border-viva-purple/30 hover:shadow-card transition-all duration-200 group"
              >
                <div className="w-full h-24 rounded-lg bg-viva-light flex items-center justify-center text-3xl mb-3 group-hover:scale-105 transition-transform">
                  {product.image}
                </div>
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-viva-danger/10 text-viva-danger font-semibold mb-1.5">
                  -{product.discount}%
                </span>
                <p className="text-xs font-semibold text-viva-graphite truncate">
                  {product.name}
                </p>
                <p className="text-[10px] text-viva-gray mb-1">
                  {product.store}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-viva-purple">
                    {formatPrice(product.currentPrice)}
                  </span>
                  <span className="text-[10px] text-viva-gray line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Desafio da Semana ─────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="bg-white rounded-2xl border border-viva-border p-5 shadow-premium hover:shadow-card transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-viva-graphite">
              Desafio da Semana
            </h2>
            <Trophy className="w-4 h-4 text-viva-warning" />
          </div>
          {weekChallenge && (
            <Link
              href="/dashboard/desafios"
              className="block group"
            >
              <div className="p-4 rounded-xl bg-gradient-to-br from-viva-purple/5 to-viva-lavender/10 border border-viva-purple/10 group-hover:border-viva-purple/30 transition-all">
                <h3 className="text-sm font-bold text-viva-graphite mb-1">
                  {weekChallenge.title}
                </h3>
                <p className="text-xs text-viva-gray mb-3 line-clamp-2">
                  {weekChallenge.description}
                </p>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-viva-gray">Progresso</span>
                    <span className="text-viva-purple font-semibold">
                      {weekChallenge.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-viva-border overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-bg transition-all duration-500"
                      style={{ width: `${weekChallenge.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-viva-gray">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {weekChallenge.participants} participantes
                  </span>
                  <span className="text-viva-purple font-semibold">
                    +{weekChallenge.xp} XP
                  </span>
                </div>
              </div>
            </Link>
          )}
        </motion.div>

        {/* ── Inspiração do Dia ─────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="bg-white rounded-2xl border border-viva-border p-5 shadow-premium hover:shadow-card transition-shadow duration-300"
        >
          <h2 className="text-sm font-semibold text-viva-graphite mb-3">
            ✨ Inspiração do Dia
          </h2>
          <div className="p-4 rounded-xl bg-gradient-to-br from-viva-pink-light/50 to-viva-lavender/10 border border-viva-pink/20">
            <p className="text-sm text-viva-graphite font-medium italic leading-relaxed">
              &quot;{mockInspiration.text}&quot;
            </p>
            <p className="text-xs text-viva-purple font-semibold mt-3">
              — {mockInspiration.author}
            </p>
          </div>
        </motion.div>

        {/* ── Quick Access Grid ─────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={6}
          className="md:col-span-2 xl:col-span-3"
        >
          <h2 className="text-sm font-semibold text-viva-graphite mb-3">
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {quickAccessItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white rounded-2xl border border-viva-border p-4 hover:border-viva-purple/30 hover:shadow-card transition-all duration-200 text-center"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center text-xl mx-auto mb-2 group-hover:scale-110 transition-transform duration-200`}
                >
                  {item.emoji}
                </div>
                <h3 className="text-xs font-semibold text-viva-graphite mb-0.5">
                  {item.title}
                </h3>
                <p className="text-[10px] text-viva-gray leading-tight">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
