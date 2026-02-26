import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useUIStore } from '@/src/lib/store';
import { Logo } from '@/src/components/shared/Logo';
import { NAV_ITEMS } from '@/src/constants';

export function AppSidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-20" : "w-72"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        <Logo collapsed={isSidebarCollapsed} textClassName="text-slate-900" />
        <button 
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {NAV_ITEMS.user.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              isActive 
                ? "bg-indigo-50 text-indigo-600" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              "group-hover:text-indigo-600"
            )} />
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

      <div className="p-4 border-t border-slate-100 space-y-2">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-slate-50",
          isSidebarCollapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
            <User size={16} />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">John Doe</p>
              <p className="text-[10px] text-slate-500 truncate">Pro Plan</p>
            </div>
          )}
        </div>
        <button className={cn(
          "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all",
          isSidebarCollapsed ? "justify-center" : ""
        )}>
          <LogOut size={20} />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
