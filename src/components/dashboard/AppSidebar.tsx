'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarHeart,
  ShoppingBag,
  Heart,
  Sparkles,
  Compass,
  BookHeart,
  Target,
  Trophy,
  Users,
  MessageCircleHeart,
  UserCircle,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Modo Evento', icon: CalendarHeart, href: '/dashboard/eventos' },
  { label: 'Promoções', icon: ShoppingBag, href: '/dashboard/promocoes' },
  { label: 'Favoritos', icon: Heart, href: '/dashboard/favoritos' },
  { label: 'Looks', icon: Sparkles, href: '/dashboard/looks' },
  { label: 'Descobrir', icon: Compass, href: '/dashboard/descobrir-eventos' },
  { label: 'Diário', icon: BookHeart, href: '/dashboard/diario' },
  { label: 'Hábitos', icon: Target, href: '/dashboard/habitos' },
  { label: 'Desafios', icon: Trophy, href: '/dashboard/desafios' },
  { label: 'Comunidade', icon: Users, href: '/dashboard/comunidade' },
  { label: 'Chat Viva AI', icon: MessageCircleHeart, href: '/dashboard/chat' },
  { label: 'Perfil', icon: UserCircle, href: '/dashboard/perfil' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const displayName = user?.name ?? 'Usuária';
  const displayInitial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white border-r border-viva-border z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-viva-border">
        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold gradient-text tracking-tight">
          Viva
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 no-scrollbar">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-viva-purple/10 text-viva-purple shadow-sm'
                      : 'text-viva-gray hover:bg-viva-light hover:text-viva-graphite'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-[18px] h-[18px] flex-shrink-0',
                      active ? 'text-viva-purple' : 'text-viva-gray'
                    )}
                  />
                  <span>{item.label}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-viva-purple" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-viva-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {displayInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-viva-graphite truncate">
              {displayName}
            </p>
            <p className="text-xs text-viva-gray truncate">
              {user?.email ?? ''}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg hover:bg-viva-light text-viva-gray hover:text-viva-danger transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
