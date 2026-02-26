import React from 'react';
import { Bot } from 'lucide-react';
import { motion } from 'motion/react';

export function TypingIndicator() {
  return (
    <div className="flex gap-4 md:gap-6 p-4 md:p-6 rounded-2xl bg-slate-50/50">
      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
        <Bot size={22} />
      </div>
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
