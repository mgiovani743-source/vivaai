'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Zap, Clock, Crown, Medal, Star } from 'lucide-react';
import { mockChallenges } from '@/data/mock';
import type { Challenge } from '@/types';

const categoryColors: Record<string, string> = {
  Beleza: 'bg-viva-pink-light text-pink-600',
  Moda: 'bg-viva-purple/10 text-viva-purple',
  Mente: 'bg-blue-50 text-blue-600',
  'Estilo de vida': 'bg-green-50 text-green-600',
};

const communityRanking = [
  { position: 1, name: 'Ana Clara', avatar: '👩‍🦰', xp: 2450, badge: '👑' },
  { position: 2, name: 'Fernanda', avatar: '👩‍🦱', xp: 1250, badge: '🥈' },
  { position: 3, name: 'Juliana', avatar: '👩', xp: 1100, badge: '🥉' },
  { position: 4, name: 'Mariana', avatar: '👩‍🦳', xp: 980, badge: '' },
  { position: 5, name: 'Beatriz', avatar: '👧', xp: 870, badge: '' },
];

export default function DesafiosPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);

  const toggleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              isJoined: !c.isJoined,
              participants: c.isJoined ? c.participants - 1 : c.participants + 1,
              progress: c.isJoined ? 0 : 10,
            }
          : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-viva-light p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-viva-graphite">
              Desafios
            </h1>
            <p className="text-viva-gray text-sm">
              Desafie-se e evolua com a comunidade
            </p>
          </div>
        </motion.div>

        {/* Challenge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge, i) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className={`bg-white rounded-3xl p-6 shadow-card space-y-4 ${
                challenge.isJoined ? 'ring-2 ring-viva-purple/20' : ''
              }`}
            >
              {/* Category & Status */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    categoryColors[challenge.category] || 'bg-viva-light text-viva-gray'
                  }`}
                >
                  {challenge.category}
                </span>
                {challenge.isJoined && (
                  <span className="text-xs font-semibold text-viva-success bg-viva-success/10 px-3 py-1 rounded-full">
                    ✓ Participando
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-lg font-bold text-viva-graphite">
                  {challenge.title}
                </h3>
                <p className="text-sm text-viva-gray mt-1 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-viva-gray">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {challenge.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-viva-warning" />
                  {challenge.xp} XP
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {challenge.participants}
                </span>
              </div>

              {/* Progress Bar */}
              {challenge.isJoined && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-viva-gray">
                      Progresso
                    </span>
                    <span className="text-xs font-bold text-viva-purple">
                      {challenge.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-viva-light rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${challenge.progress}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full gradient-bg rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Ranking */}
              {challenge.isJoined && challenge.ranking && (
                <div className="bg-viva-light rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-semibold text-viva-graphite flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-viva-warning" />
                    Top 5 do Desafio
                  </span>
                  {challenge.ranking.map((r) => (
                    <div
                      key={r.position}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-viva-gray w-4">
                          {r.position}º
                        </span>
                        <span className="text-sm">{r.avatar}</span>
                        <span className="text-sm font-medium text-viva-graphite">
                          {r.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-viva-purple">
                        {r.xp} XP
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Join Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleJoin(challenge.id)}
                className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                  challenge.isJoined
                    ? 'bg-viva-light text-viva-gray hover:bg-red-50 hover:text-viva-danger'
                    : 'gradient-bg text-white hover:shadow-glow'
                }`}
              >
                {challenge.isJoined ? 'Sair do Desafio' : 'Participar'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Community Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-card"
        >
          <h2 className="text-lg font-semibold text-viva-graphite mb-6 flex items-center gap-2">
            <Medal className="w-5 h-5 text-viva-purple" />
            Ranking Geral da Comunidade
          </h2>

          <div className="space-y-3">
            {communityRanking.map((entry, i) => (
              <motion.div
                key={entry.position}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-2xl ${
                  entry.position <= 3
                    ? 'bg-gradient-to-r from-viva-purple/5 to-viva-pink-light/50'
                    : 'bg-viva-light'
                } ${entry.name === 'Fernanda' ? 'ring-2 ring-viva-purple/30' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {entry.badge ? (
                      <span className="text-xl">{entry.badge}</span>
                    ) : (
                      <span className="text-sm font-bold text-viva-gray">
                        {entry.position}º
                      </span>
                    )}
                  </div>
                  <span className="text-2xl">{entry.avatar}</span>
                  <div>
                    <span className="font-semibold text-viva-graphite">
                      {entry.name}
                    </span>
                    {entry.name === 'Fernanda' && (
                      <span className="ml-2 text-xs text-viva-purple font-medium">
                        (Você)
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-viva-warning" />
                  <span className="font-bold text-viva-graphite">
                    {entry.xp.toLocaleString()} XP
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
