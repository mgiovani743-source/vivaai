'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  MousePointerClick,
  Heart,
  CalendarDays,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowLeft,
  Package,
} from 'lucide-react';
import { mockAdminMetrics, mockProducts } from '@/data/mock';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductCategory } from '@/types';

const categories: ProductCategory[] = [
  'Moda',
  'Beleza',
  'Acessórios',
  'Fitness',
  'Eventos',
  'Autocuidado',
  'Achadinhos da semana',
];

const metricsConfig = [
  {
    key: 'activeUsers',
    label: 'Usuárias Ativas',
    icon: Users,
    color: 'text-viva-purple',
    bg: 'bg-viva-purple/10',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'affiliateClicks',
    label: 'Cliques em Afiliados',
    icon: MousePointerClick,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'favoriteProducts',
    label: 'Produtos Favoritos',
    icon: Heart,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'eventsCreated',
    label: 'Eventos Criados',
    icon: CalendarDays,
    color: 'text-green-600',
    bg: 'bg-green-50',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'estimatedRevenue',
    label: 'Receita Estimada',
    icon: DollarSign,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    format: (v: number) => formatPrice(v),
  },
  {
    key: 'growthPercent',
    label: 'Crescimento',
    icon: TrendingUp,
    color: 'text-viva-success',
    bg: 'bg-green-50',
    format: (v: number) => `+${v}%`,
  },
] as const;

interface NewProduct {
  name: string;
  category: ProductCategory;
  originalPrice: string;
  currentPrice: string;
  store: string;
  tag: string;
  link: string;
}

const emptyForm: NewProduct = {
  name: '',
  category: 'Moda',
  originalPrice: '',
  currentPrice: '',
  store: '',
  tag: '',
  link: '',
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [form, setForm] = useState<NewProduct>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const toggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Fix: use functional setState properly
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.originalPrice || !form.currentPrice || !form.store) return;

    const original = parseFloat(form.originalPrice);
    const current = parseFloat(form.currentPrice);

    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: form.name,
      category: form.category,
      originalPrice: original,
      currentPrice: current,
      discount: Math.round(((original - current) / original) * 100),
      store: form.store,
      tag: form.tag || '🆕 Novo',
      image: '📦',
      link: form.link || '#',
      isFavorite: false,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-viva-graphite flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Admin Viva AI
              </h1>
              <p className="text-gray-500 text-sm">
                Painel de administração
              </p>
            </div>
          </div>
          <a
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-viva-purple transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </a>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {metricsConfig.map((metric, i) => {
            const Icon = metric.icon;
            const value = mockAdminMetrics[metric.key as keyof typeof mockAdminMetrics];
            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className={`w-10 h-10 ${metric.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
                <p className="text-xl font-bold text-gray-900">
                  {metric.format(value as number)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Products Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              Gerenciamento de Produtos
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-viva-purple text-white text-sm font-medium rounded-xl hover:bg-viva-purple-dark transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Adicionar Promoção
            </button>
          </div>

          {/* Add Product Form */}
          {showForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddProduct}
              className="px-6 py-4 bg-gray-50 border-b border-gray-100 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-viva-purple/30"
                />
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as ProductCategory })
                  }
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-viva-purple/30 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Preço original"
                  value={form.originalPrice}
                  onChange={(e) =>
                    setForm({ ...form, originalPrice: e.target.value })
                  }
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-viva-purple/30"
                />
                <input
                  type="number"
                  placeholder="Preço atual"
                  value={form.currentPrice}
                  onChange={(e) =>
                    setForm({ ...form, currentPrice: e.target.value })
                  }
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-viva-purple/30"
                />
                <input
                  type="text"
                  placeholder="Loja"
                  value={form.store}
                  onChange={(e) => setForm({ ...form, store: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-viva-purple/30"
                />
                <input
                  type="text"
                  placeholder="Tag (ex: 🔥 Oferta)"
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-viva-purple/30"
                />
                <input
                  type="text"
                  placeholder="Link (URL)"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-viva-purple/30 md:col-span-2"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-viva-purple text-white text-sm font-medium rounded-xl hover:bg-viva-purple-dark transition-colors cursor-pointer"
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </motion.form>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Desconto
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Loja
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      !product.isActive ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{product.image}</span>
                        <span className="font-medium text-gray-900 truncate max-w-[200px]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                      {product.category}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-xs line-through text-gray-400 block">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(product.currentPrice)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                        -{product.discount}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden lg:table-cell">
                      {product.store}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(product.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          product.isActive ? 'bg-viva-success' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            product.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
