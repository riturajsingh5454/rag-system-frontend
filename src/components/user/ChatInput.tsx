import React, { useState } from 'react';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { cn } from '@/src/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-xl focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all"
    >
      <button 
        type="button"
        className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
      >
        <Paperclip size={20} />
      </button>
      
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything about your documents..."
        className="flex-1 border-none shadow-none focus-visible:ring-0 py-6 text-base"
        disabled={isLoading}
      />

      <Button 
        type="submit" 
        disabled={!input.trim() || isLoading}
        className="rounded-xl px-6 py-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all active:scale-95"
      >
        {isLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            <span className="hidden sm:inline mr-2">Send</span>
            <Send size={18} />
          </>
        )}
      </Button>
    </form>
  );
}
