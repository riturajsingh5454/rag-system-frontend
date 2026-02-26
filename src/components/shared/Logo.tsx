import React from 'react';
import { Database } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { APP_CONFIG } from '@/src/constants';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function Logo({ collapsed, className, iconClassName, textClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 overflow-hidden", className)}>
      <div className={cn(
        "shrink-0 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20",
        iconClassName
      )}>
        <Database size={24} />
      </div>
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn("font-bold text-xl tracking-tight text-white whitespace-nowrap", textClassName)}
        >
          {APP_CONFIG.shortName}
        </motion.span>
      )}
    </div>
  );
}
