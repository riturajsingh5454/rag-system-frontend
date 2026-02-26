import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { useUIStore } from '@/src/lib/store';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { APP_CONFIG } from '@/src/constants';
import { Logo } from '@/src/components/shared/Logo';

export function UserLayout() {
  const { isSidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
            >
              <AppSidebar />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-12 p-2 bg-white rounded-xl shadow-lg text-slate-500"
              >
                <X size={20} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300 min-w-0",
        isSidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
      )}>
        {/* Mobile Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 lg:hidden">
          <div className="flex items-center gap-3">
            <Menu size={24} onClick={() => setIsMobileMenuOpen(true)} className="cursor-pointer text-slate-600" />
            <Logo textClassName="text-slate-900" iconClassName="w-8 h-8" />
          </div>
        </header>

        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
