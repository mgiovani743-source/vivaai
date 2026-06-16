'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  MessageCircle,
  Trophy,
  ShoppingBag,
  Sparkles,
  Calendar,
  Crown,
  ExternalLink,
} from 'lucide-react';
import { mockCommunityPosts, mockProducts, mockLooks } from '@/data/mock';
import { timeAgo, formatPrice } from '@/lib/utils';
import type { CommunityPost } from '@/types';

type TabFilter = 'tudo' | 'depoimento' | 'look' | 'achadinho' | 'evento';

const tabs: { key: TabFilter; label: string }[] = [
  { key: 'tudo', label: 'Tudo' },
  { key: 'depoimento', label: 'Depoimentos' },
  { key: 'look', label: 'Looks' },
  { key: 'achadinho', label: 'Achadinhos' },
  { key: 'evento', label: 'Eventos' },
];

const typeBadge: Record<string, { bg: string; text: string }> = {
  depoimento: { bg: 'bg-viva-purple/10', text: 'text-viva-purple' },
  look: { bg: 'bg-viva-pink-light', text: 'text-pink-600' },
  achadinho: { bg: 'bg-green-50', text: 'text-green-600' },
  evento: { bg: 'bg-blue-50', text: 'text-blue-600' },
  geral: { bg: 'bg-viva-light', text: 'text-viva-gray' },
};

const communityEvents = [
  { title: 'Yoga no Parque', date: '8 Jul', location: 'Ibirapuera', emoji: '🧘', members: 23 },
  { title: 'Encontro Viva SP', date: '15 Jul', location: 'Vila Madalena', emoji: '💜', members: 45 },
  { title: 'Workshop Estilo', date: '20 Jul', location: 'Online', emoji: '👗', members: 67 },
];

export default function ComunidadePage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('tudo');
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const filteredPosts =
    activeTab === 'tudo'
      ? posts
      : posts.filter((p) => p.type === activeTab);

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: likedPosts.has(postId) ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const handleVIP = () => {
    alert('🎉 Em breve! O grupo VIP da Viva está chegando. Você será a primeira a saber!');
  };

  const achadinhos = mockProducts.slice(0, 3);
  const looks = mockLooks.slice(0, 3);

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
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-viva-graphite">
              Comunidade Viva
            </h1>
            <p className="text-viva-gray text-sm">
              Conecte-se, inspire-se e evolua juntas
            </p>
          </div>
        </motion.div>

        {/* Tab Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto no-scrollbar"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'gradient-bg text-white shadow-glow'
                  : 'bg-white text-viva-gray hover:bg-viva-purple/5 hover:text-viva-purple'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Challenge Highlight */}
        <motion.a
          href="/dashboard/desafios"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="block gradient-bg rounded-3xl p-6 text-white shadow-glow hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6" />
            <span className="font-bold text-lg">Desafio da Comunidade</span>
          </div>
          <p className="text-white/90 text-sm">
            🔥 342 membros participando do desafio &quot;7 Dias de Skincare
            Completa&quot;. Participe e ganhe 150 XP!
          </p>
          <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold bg-white/20 px-4 py-1.5 rounded-full">
            Ver desafios <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </motion.a>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-card space-y-3"
            >
              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{post.avatar}</span>
                  <div>
                    <span className="font-semibold text-viva-graphite text-sm">
                      {post.author}
                    </span>
                    <p className="text-xs text-viva-gray">
                      {timeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    typeBadge[post.type]?.bg || 'bg-viva-light'
                  } ${typeBadge[post.type]?.text || 'text-viva-gray'}`}
                >
                  {post.type}
                </span>
              </div>

              {/* Content */}
              <p className="text-sm text-viva-graphite/80 leading-relaxed">
                {post.content}
              </p>

              {/* Image placeholder */}
              {post.image && (
                <div className="bg-viva-light rounded-xl p-8 text-center text-4xl">
                  {post.image}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-6 pt-2 border-t border-viva-border/50">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
                    likedPosts.has(post.id)
                      ? 'text-viva-danger'
                      : 'text-viva-gray hover:text-viva-danger'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`}
                  />
                  {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1.5 text-sm font-medium text-viva-gray hover:text-viva-purple transition-colors cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achadinhos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-viva-graphite mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-viva-purple" />
            Achadinhos da Comunidade
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {achadinhos.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 shadow-card space-y-2"
              >
                <div className="text-4xl text-center py-3">{product.image}</div>
                <p className="text-sm font-semibold text-viva-graphite truncate">
                  {product.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs line-through text-viva-gray">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-sm font-bold text-viva-success">
                    {formatPrice(product.currentPrice)}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-viva-danger bg-viva-danger/10 px-2 py-0.5 rounded-full">
                  -{product.discount}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Looks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-viva-graphite mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-viva-purple" />
            Looks das Membros
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {looks.map((look) => (
              <div
                key={look.id}
                className="bg-white rounded-2xl p-4 shadow-card space-y-2"
              >
                <div className="text-4xl text-center py-3">{look.image}</div>
                <p className="text-sm font-bold text-viva-graphite">{look.title}</p>
                <p className="text-xs text-viva-gray">
                  {look.items.slice(0, 2).join(' • ')}
                </p>
                <div className="flex items-center gap-1 text-xs text-viva-gray">
                  <Heart className="w-3 h-3 text-viva-danger" />
                  {look.likes}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Community Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-lg font-semibold text-viva-graphite mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-viva-purple" />
            Eventos que a comunidade vai
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {communityEvents.map((event, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3"
              >
                <span className="text-3xl">{event.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-viva-graphite truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-viva-gray">
                    {event.date} • {event.location}
                  </p>
                  <p className="text-xs text-viva-purple font-medium">
                    {event.members} membros vão
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* VIP CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-card text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto gradient-bg rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-viva-graphite">
            Grupo VIP da Viva
          </h3>
          <p className="text-sm text-viva-gray max-w-md mx-auto">
            Acesso exclusivo a promoções, looks personalizados, eventos e uma
            comunidade de mulheres incríveis que se apoiam todos os dias.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVIP}
            className="gradient-bg text-white font-semibold px-8 py-3 rounded-2xl shadow-glow cursor-pointer"
          >
            ✨ Entrar no Grupo VIP
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
