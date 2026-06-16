'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircle,
  Save,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

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
  const { profile, loading, saving, saveSuccess, error, saveProfile, setProfile } = useProfile();
  const [localSaveError, setLocalSaveError] = useState<string | null>(null);

  const toggleItem = (
    item: string,
    list: string[],
    field: 'goals' | 'style_preferences' | 'interests'
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item],
    }));
  };

  const handleSave = async () => {
    setLocalSaveError(null);
    await saveProfile(profile);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-viva-purple animate-spin" />
          <p className="text-sm text-viva-gray">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-viva-light p-4 md:p-8 relative">
      {/* Toast de sucesso */}
      <AnimatePresence>
        {saveSuccess && (
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

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-card"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-glow">
              {(profile.full_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-viva-graphite">
                {profile.full_name || 'Sua conta Viva'}
              </p>
              <p className="text-sm text-viva-gray mt-1">
                {profile.city ? `📍 ${profile.city}` : 'Adicione sua cidade'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Erro geral */}
        {(error || localSaveError) && (
          <div className="flex items-center gap-2 rounded-xl bg-viva-danger/10 border border-viva-danger/20 p-3">
            <AlertCircle className="h-4 w-4 text-viva-danger flex-shrink-0" />
            <p className="text-sm text-viva-danger">{error ?? localSaveError}</p>
          </div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-card space-y-6"
        >
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-2">
              Nome
            </label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl border border-viva-border bg-viva-light/50 text-viva-graphite focus:outline-none focus:ring-2 focus:ring-viva-purple/30 focus:border-viva-purple/50 transition-all"
              placeholder="Seu nome completo"
            />
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-2">
              Cidade
            </label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl border border-viva-border bg-viva-light/50 text-viva-graphite focus:outline-none focus:ring-2 focus:ring-viva-purple/30 focus:border-viva-purple/50 transition-all"
              placeholder="Ex: São Paulo"
            />
          </div>

          {/* Objetivos */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-3">
              Objetivos
            </label>
            <div className="flex flex-wrap gap-2">
              {allObjectives.map((obj) => (
                <button
                  key={obj}
                  onClick={() => toggleItem(obj, profile.goals, 'goals')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    profile.goals.includes(obj)
                      ? 'gradient-bg text-white shadow-glow'
                      : 'bg-viva-light text-viva-gray hover:bg-viva-purple/5 hover:text-viva-purple border border-viva-border'
                  }`}
                >
                  {profile.goals.includes(obj) && <Check className="w-3.5 h-3.5" />}
                  {obj}
                </button>
              ))}
            </div>
          </div>

          {/* Preferências de moda */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-3">
              Preferências de moda
            </label>
            <div className="flex flex-wrap gap-2">
              {allFashionPrefs.map((pref) => (
                <button
                  key={pref}
                  onClick={() => toggleItem(pref, profile.style_preferences, 'style_preferences')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    profile.style_preferences.includes(pref)
                      ? 'bg-viva-pink-light text-pink-700 ring-1 ring-pink-300'
                      : 'bg-viva-light text-viva-gray hover:bg-viva-pink-light/50 border border-viva-border'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Orçamento */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-2">
              Orçamento médio (R$)
            </label>
            <input
              type="number"
              value={profile.average_budget}
              onChange={(e) =>
                setProfile((p) => ({ ...p, average_budget: Number(e.target.value) }))
              }
              className="w-full px-4 py-3 rounded-2xl border border-viva-border bg-viva-light/50 text-viva-graphite focus:outline-none focus:ring-2 focus:ring-viva-purple/30 focus:border-viva-purple/50 transition-all"
              placeholder="Ex: 300"
            />
          </div>

          {/* Interesses */}
          <div>
            <label className="block text-sm font-semibold text-viva-graphite mb-3">
              Interesses
            </label>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleItem(interest, profile.interests, 'interests')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    profile.interests.includes(interest)
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
            disabled={saving}
            className="w-full md:w-auto gradient-bg text-white font-semibold px-8 py-3 rounded-2xl shadow-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar alterações
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
