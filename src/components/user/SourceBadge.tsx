import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { Source } from '@/src/types';

interface SourceBadgeProps {
  source: Source;
}

export function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <div className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm cursor-help">
      <FileText size={12} className="text-slate-400 group-hover:text-indigo-500" />
      <span className="truncate max-w-[120px]">{source.title}</span>
      {source.url && <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
    </div>
  );
}
