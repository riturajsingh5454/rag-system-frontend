import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Zap, ShieldCheck, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '@/src/components/user/ChatMessage';
import { ChatInput } from '@/src/components/user/ChatInput';
import { TypingIndicator } from '@/src/components/user/TypingIndicator';
import { EmptyState } from '@/src/components/user/EmptyState';
import { Message } from '@/src/types';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { APP_CONFIG } from '@/src/constants';

export default function UserChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Mock API call
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      });
      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString(),
        sources: data.sources?.map((s: any, i: number) => ({
          id: i.toString(),
          title: s.name,
          content: s.content
        })),
        responseTime: data.responseTime || 450
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Header Info */}
      <div className="h-14 border-b border-slate-100 bg-white/50 backdrop-blur-sm  items-center justify-between px-8 sticky top-0 z-20 hidden lg:flex">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            System: Operational
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Zap size={12} className="text-amber-500" />
            Latency: 450ms
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMessages([])}
            className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            Clear Chat
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
            Export Chat
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto w-full px-6 py-12">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={scrollRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 md:p-10 bg-linear-to-t from-slate-50 via-slate-50 to-transparent">
        <div className="max-w-4xl mx-auto w-full">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
          <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">
            {APP_CONFIG.shortName} can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
