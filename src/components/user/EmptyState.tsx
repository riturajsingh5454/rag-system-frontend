import React from 'react';
import { MessageSquare, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { APP_CONFIG } from '@/src/constants';

export function EmptyState() {
  const features = [
    { icon: Sparkles, text: "Trained on your specific documents" },
    { icon: ShieldCheck, text: "Secure and private data processing" },
    { icon: Zap, text: "Instant answers with source citations" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center space-y-8 py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 shadow-inner"
      >
        <MessageSquare size={40} />
      </motion.div>

      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          {APP_CONFIG.shortName} Assistant
        </h2>
        <p className="text-slate-500 text-lg">
          Ask anything from your trained documents and get instant, accurate responses.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col items-center gap-3"
          >
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <feature.icon size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-600 leading-tight">
              {feature.text}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 w-full">
        <div className="p-6 bg-slate-900 rounded-3xl text-left relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              Try asking:
            </h4>
            <ul className="space-y-2">
              {[
                "What are the key findings in the Q4 report?",
                "Summarize the compliance requirements for 2024.",
                "Compare the latest guidelines with the previous version."
              ].map((q, i) => (
                <li key={i} className="text-slate-400 text-sm hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                  {q}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/30 transition-all" />
        </div>
      </div>
    </div>
  );
}
