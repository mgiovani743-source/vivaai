import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
