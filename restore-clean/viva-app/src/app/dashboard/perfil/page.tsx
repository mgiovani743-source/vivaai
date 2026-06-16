'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircle,
  Save,
  Star,
  Zap,
  Flame,
  TrendingUp,
  Check,
} from 'lucide-react';
import { mockUser } from '@/data/mock';

const allObjectives = [
  'Autoconfiança',
  'Estilo pessoal',
  'Bem-estar',
  'Carreira',
  'Relacionamentos',
  'Finanças',
];

const allFashionPrefs = [
  'Casual chique',
  'Minimalista',
  'Elegante',
  'Streetwear',
  'Boho',
  'Romântico',
];

const allInterests = [
  'Moda',
  'Shows',
  'Yoga',
  'Skincare',
  'Fitness',
  'Gastronomia',
  'Viagens',
];

export default function PerfilPage() {
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [city, setCity] = useState(mockUser.city);
  const [objectives, setObjectives] = useState<string[]>(mockUser.objectives);
  const [fashionPrefs, setFashionPrefs] = useState<string[]>(mockUser.fashionPreferences);
  const [budget, setBudget] = useState(mockUser.averageBudget);
  const [interests, setInterests] = useState<string[]>(mockUser.interests);
  const [showToast, setShowToast] = useState(false);

  const toggleItem = (
    item: string,
    list: string[],
    setList: (val: string[]) => void
  ) => {
    setList(
      list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item]
    );
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-viva-light p-4 md:p-8 relative">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 bg-viva-success text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 font-medium"
          >
            <Check className="w-5 h-5" />
            Perfil salvo com sucesso!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-viva-graphite">
              Meu Perfil
            </h1>
            <p className="text-viva-gray text-sm">
              Personalize sua experiência Viva
            </p>
          </div>
        </motion.div>

        {/* Avatar + Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-card"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-glow">
              {name.charAt(0).toUpperCase()}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 w-full">
              {[
                {
                  icon: <Star className="w-4 h-4 text-viva-warning" />,
                  label: 'Level',
                  value: mockUser.level,
                },
                {
                  icon: <Zap className="w-4 h-4 text-viva-purple" />,
                  label: 'XP',
                  value: mockUser.xp.toLocaleString(),
                },
                {
                  icon: <Flame className="w-4 h-4 text-orange-500" />,
                  label: 'Streak',
                  value: `${mockUser.streak} dias`,
                },
                {
                  icon: <TrendingUp className="w-4 h-4 text-viva-success" />,
                  label: 'Evolução',
                  value: `${mockUser.evolutionScore}%`,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-viva-light rounded-2xl p-3 text-center"
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {stat.icon}
                    <span className="text-xs text-viva-gray">{stat.label}</span>
                  </div>
                  <span className="text-lg font-bold text-viva-graphite">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-card space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-2">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-viva-border bg-viva-light/50 text-viva-graphite focus:outline-none focus:ring-2 focus:ring-viva-purple/30 focus:border-viva-purple/50 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-viva-border bg-viva-light/50 text-viva-graphite focus:outline-none focus:ring-2 focus:ring-viva-purple/30 focus:border-viva-purple/50 transition-all"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-2">
              Cidade
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-viva-border bg-viva-light/50 text-viva-graphite focus:outline-none focus:ring-2 focus:ring-viva-purple/30 focus:border-viva-purple/50 transition-all"
            />
          </div>

          {/* Objectives */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-3">
              Objetivos
            </label>
            <div className="flex flex-wrap gap-2">
              {allObjectives.map((obj) => (
                <button
                  key={obj}
                  onClick={() => toggleItem(obj, objectives, setObjectives)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    objectives.includes(obj)
                      ? 'gradient-bg text-white shadow-glow'
                      : 'bg-viva-light text-viva-gray hover:bg-viva-purple/5 hover:text-viva-purple border border-viva-border'
                  }`}
                >
                  {objectives.includes(obj) && <Check className="w-3.5 h-3.5" />}
                  {obj}
                </button>
              ))}
            </div>
          </div>

          {/* Fashion Preferences */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-3">
              Preferências de moda
            </label>
            <div className="flex flex-wrap gap-2">
              {allFashionPrefs.map((pref) => (
                <button
                  key={pref}
                  onClick={() => toggleItem(pref, fashionPrefs, setFashionPrefs)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    fashionPrefs.includes(pref)
                      ? 'bg-viva-pink-light text-pink-700 ring-1 ring-pink-300'
                      : 'bg-viva-light text-viva-gray hover:bg-viva-pink-light/50 border border-viva-border'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-2">
              Orçamento médio (R$)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl border border-viva-border bg-viva-light/50 text-viva-graphite focus:outline-none focus:ring-2 focus:ring-viva-purple/30 focus:border-viva-purple/50 transition-all"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-3">
              Interesses
            </label>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleItem(interest, interests, setInterests)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    interests.includes(interest)
                      ? 'bg-viva-purple/10 text-viva-purple ring-1 ring-viva-purple/30'
                      : 'bg-viva-light text-viva-gray hover:bg-viva-purple/5 border border-viva-border'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full md:w-auto gradient-bg text-white font-semibold px-8 py-3 rounded-2xl shadow-glow flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            Salvar alterações
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
