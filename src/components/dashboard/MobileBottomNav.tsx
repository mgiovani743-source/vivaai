'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarHeart,
  ShoppingBag,
  MessageCircleHeart,
  UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Home', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Eventos', icon: CalendarHeart, href: '/dashboard/eventos' },
  { label: 'Promoções', icon: ShoppingBag, href: '/dashboard/promocoes' },
  { label: 'Chat', icon: MessageCircleHeart, href: '/dashboard/chat' },
  { label: 'Perfil', icon: UserCircle, href: '/dashboard/perfil' },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-viva-border/50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex w-full justify-around items-center px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]',
                active ? 'text-viva-purple' : 'text-viva-gray'
              )}
            >
              <div
                className={cn(
                  'p-1 rounded-lg transition-colors',
                  active && 'bg-viva-purple/10'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5',
                    active ? 'text-viva-purple' : 'text-viva-gray'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium leading-tight',
                  active ? 'text-viva-purple' : 'text-viva-gray'
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
