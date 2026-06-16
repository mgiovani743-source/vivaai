/**
 * Dashboard Layout — rotas protegidas /dashboard/*
 *
 * AuthProvider está aqui (não no root layout) para que a LP pública `/`
 * nunca inicialize Supabase Auth nem gere erros de rede.
 *
 * TODO: Adicionar middleware de proteção de rota quando Supabase Auth
 *       estiver configurado (verificar sessão no server-side via
 *       src/lib/supabase/server.ts e redirecionar para /login se não autenticado).
 */
import { AuthProvider } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-viva-light">
        {/* Desktop Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <main className="ml-0 lg:ml-64 pb-20 lg:pb-0 min-h-screen">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </AuthProvider>
  );
}
