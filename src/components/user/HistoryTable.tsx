import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Calendar,
  MessageSquare,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/src/components/ui/table';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { HistoryItem } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface HistoryTableProps {
  items: HistoryItem[];
}

export function HistoryTable({ items }: HistoryTableProps) {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = items.filter(item => 
    item.question.toLowerCase().includes(search.toLowerCase()) ||
    item.answer.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input 
          placeholder="Search history..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 py-6 rounded-2xl border-slate-200 focus:ring-indigo-500/10"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Question</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest hidden md:table-cell">Response Time</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest hidden sm:table-cell">Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <React.Fragment key={item.id}>
                <TableRow 
                  className={cn(
                    "group cursor-pointer transition-colors",
                    expandedId === item.id ? "bg-indigo-50/30" : "hover:bg-slate-50/50"
                  )}
                  onClick={() => toggleExpand(item.id)}
                >
                  <TableCell>
                    <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                      {expandedId === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 line-clamp-1">{item.question}</span>
                      <span className="text-xs text-slate-500 line-clamp-1 md:hidden mt-1">{item.answer}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Clock size={12} className="text-slate-300" />
                      {item.responseTime}ms
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Calendar size={12} className="text-slate-300" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </TableCell>
                </TableRow>
                <AnimatePresence>
                  {expandedId === item.id && (
                    <TableRow className="bg-slate-50/30 border-none">
                      <TableCell colSpan={5} className="p-0">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Question</h4>
                                <div className="p-4 bg-white border border-slate-100 rounded-2xl text-sm text-slate-900 font-medium">
                                  {item.question}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Response</h4>
                                <div className="p-4 bg-white border border-slate-100 rounded-2xl text-sm text-slate-700 leading-relaxed">
                                  {item.answer}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sources Cited</h4>
                              <div className="flex flex-wrap gap-2">
                                {item.sources.map((source) => (
                                  <div key={source.id} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 shadow-sm hover:border-indigo-300 transition-all cursor-pointer">
                                    <MessageSquare size={12} className="text-indigo-500" />
                                    {source.title}
                                    <ExternalLink size={10} className="text-slate-300" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        {filteredItems.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
              <Search size={32} />
            </div>
            <p className="text-slate-500 font-medium">No queries found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
