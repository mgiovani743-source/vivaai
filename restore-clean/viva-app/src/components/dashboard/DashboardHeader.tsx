'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { mockUser } from '@/data/mock';
import { getGreeting } from '@/lib/utils';

export function DashboardHeader() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex items-center justify-between mb-6">
      {/* Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-viva-graphite">
          {getGreeting()},{' '}
          <span className="gradient-text">{mockUser.name}</span> 💜
        </h1>
        <p className="text-sm text-viva-gray mt-0.5">
          Nível {mockUser.level} • {mockUser.streak} dias de sequência 🔥
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            if (!showNotifications) {
              setTimeout(() => setShowNotifications(false), 3000);
            }
          }}
          className="relative p-2.5 rounded-xl bg-white border border-viva-border hover:border-viva-purple/30 hover:bg-viva-purple/5 transition-all duration-200"
        >
          <Bell className="w-5 h-5 text-viva-gray" />
          {/* Notification badge */}
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-viva-danger rounded-full border-2 border-white" />
        </button>

        {/* User avatar */}
        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:shadow-glow transition-shadow duration-200">
          {mockUser.name.charAt(0)}
        </div>
      </div>

      {/* Notification dropdown (mockado) */}
      {showNotifications && (
        <div className="absolute top-16 right-4 sm:right-6 w-72 bg-white rounded-2xl shadow-card border border-viva-border p-4 z-50">
          <h3 className="text-sm font-semibold text-viva-graphite mb-3">
            Notificações
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2 rounded-xl bg-viva-purple/5">
              <span className="text-lg">🎉</span>
              <div>
                <p className="text-xs font-medium text-viva-graphite">
                  Novo desafio disponível!
                </p>
                <p className="text-xs text-viva-gray mt-0.5">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-viva-light transition-colors">
              <span className="text-lg">🛍️</span>
              <div>
                <p className="text-xs font-medium text-viva-graphite">
                  Promoção relâmpago: 50% off na Sephora
                </p>
                <p className="text-xs text-viva-gray mt-0.5">Há 5 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-viva-light transition-colors">
              <span className="text-lg">💜</span>
              <div>
                <p className="text-xs font-medium text-viva-graphite">
                  Ana curtiu seu look!
                </p>
                <p className="text-xs text-viva-gray mt-0.5">Há 1 dia</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
