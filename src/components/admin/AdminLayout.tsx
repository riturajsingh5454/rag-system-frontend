import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LogOut, 
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useUIStore } from '@/src/lib/store';
import { Logo } from '@/src/components/shared/Logo';
import { NAV_ITEMS, APP_CONFIG } from '@/src/constants';

export function AdminSidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-20" : "w-72"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        <Logo collapsed={isSidebarCollapsed} />
        <button 
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {NAV_ITEMS.admin.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              isActive 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon size={20} />
            {!isSidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-slate-800/50",
          isSidebarCollapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 shadow-sm">
            <User size={16} />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Admin User</p>
              <p className="text-[10px] text-slate-500 truncate">Super Admin</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
          className={cn(
            "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all",
            isSidebarCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut size={20} />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export function AdminLayout() {
  const { isSidebarCollapsed } = useUIStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
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
              <AdminSidebar />
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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 lg:hidden">
          <div className="flex items-center gap-3">
            <Menu size={24} onClick={() => setIsMobileMenuOpen(true)} className="cursor-pointer text-slate-600" />
            <span className="font-bold text-lg tracking-tight text-slate-900">{APP_CONFIG.shortName} Admin</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
