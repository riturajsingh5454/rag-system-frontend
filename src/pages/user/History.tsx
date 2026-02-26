import React, { useState, useEffect } from 'react';
import { History, Download, Trash2, Filter, RefreshCw } from 'lucide-react';
import { HistoryTable } from '@/src/components/user/HistoryTable';
import { Button } from '@/src/components/ui/button';
import { HistoryItem } from '@/src/types';
import { APP_CONFIG } from '@/src/constants';

export default function UserHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      setHistory(data.map((h: any) => ({
        id: h.id.toString(),
        question: h.question,
        answer: h.answer,
        timestamp: h.created_at,
        responseTime: h.response_time || 0,
        sources: [] // Mock sources for history
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-12 space-y-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Query History</h1>
          <p className="text-slate-500 text-lg">Review and manage your past interactions with the AI.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl gap-2" onClick={fetchHistory} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Refresh
          </Button>
          <Button variant="outline" className="rounded-xl gap-2" onClick={() => alert('Exporting history to CSV...')}>
            <Download size={16} /> Export CSV
          </Button>
          <Button variant="destructive" className="rounded-xl gap-2" onClick={() => {
            if(confirm('Clear all query history?')) {
              setHistory([]);
              alert('History cleared.');
            }
          }}>
            <Trash2 size={16} /> Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <History size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Total Interactions</p>
              <p className="text-2xl font-black text-indigo-600">{history.length}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-500 gap-2">
            <Filter size={14} /> Advanced Filters
          </Button>
        </div>

        <HistoryTable items={history} />
      </div>
    </div>
  );
}
