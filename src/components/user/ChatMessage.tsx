import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/src/lib/utils';
import { Message } from '@/src/types';
import { SourceBadge } from './SourceBadge';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 md:gap-6 p-4 md:p-6 rounded-2xl transition-colors",
        isAssistant ? "bg-slate-50/50" : "bg-white"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
        isAssistant ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
      )}>
        {isAssistant ? <Bot size={22} /> : <User size={22} />}
      </div>

      <div className="flex-1 space-y-4 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isAssistant ? "AI Assistant" : "You"}
          </span>
          {isAssistant && (
            <div className="flex items-center gap-3">
              {message.responseTime && (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {message.responseTime}ms
                </span>
              )}
              <button 
                onClick={copyToClipboard}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>

        <div className="prose prose-slate max-w-none prose-sm md:prose-base">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {isAssistant && message.sources && message.sources.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Sources used</p>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source) => (
                <SourceBadge key={source.id} source={source} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
