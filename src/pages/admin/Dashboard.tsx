import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Download, 
  Layers, 
  ShieldCheck, 
  ShieldAlert, 
  Bell 
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { cn } from '@/src/lib/utils';
import { APP_CONFIG, MOCK_DATA } from '@/src/constants';

const CHART_DATA = [
  { name: 'Feb 1', updates: 30 },
  { name: 'Feb 2', updates: 50 },
  { name: 'Feb 3', updates: 40 },
  { name: 'Feb 4', updates: 80 },
  { name: 'Feb 5', updates: 60 },
  { name: 'Feb 6', updates: 45 },
  { name: 'Feb 7', updates: 70 },
];

const DashboardView = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const displayStats = { ...MOCK_DATA.stats, ...stats };

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{APP_CONFIG.name} Dashboard</h1>
          <p className="text-slate-500 mt-1">Monitoring regulatory changes and banking guidelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => alert('Generating compliance audit report...')}>
            <Download size={16} /> Compliance Audit
          </Button>
          <Button size="sm" className="gap-2" onClick={() => window.location.href = '/upload'}>
            <Plus size={16} /> Add Guideline
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Guidelines', value: displayStats.totalDocuments, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Updated live' },
          { label: 'Knowledge Base', value: displayStats.totalChunks, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Fully indexed' },
          { label: 'Compliance Score', value: displayStats.complianceScore || '94%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+2% from Q3' },
          { label: 'Critical Updates', value: displayStats.criticalUpdates || 0, icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Action required' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                  <stat.icon size={24} />
                </div>
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-lg",
                  stat.color.includes('rose') ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {stat.trend}
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 tabular-nums">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle className="font-bold text-slate-900 text-lg">Regulatory Activity</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">Notifications</Badge>
              <Badge variant="outline">Circulars</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-xl border border-slate-800">
                            {payload[0].value} updates
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="updates" radius={[6, 6, 0, 0]}>
                    {CHART_DATA.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 3 ? '#4f46e5' : '#e0e7ff'} 
                        className="hover:fill-indigo-600 transition-colors cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle className="font-bold text-slate-900 text-lg">Recent Alerts</CardTitle>
            <Bell size={18} className="text-slate-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_DATA.alerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                  <Badge variant={alert.impact === 'High' ? 'destructive' : 'secondary'}>
                    {alert.impact}
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">{alert.description}</p>
                <div className="text-[9px] text-slate-400 mt-2 font-medium uppercase tracking-wider">{alert.date}</div>
              </div>
            ))}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Button variant="ghost" className="w-full text-xs py-2 text-indigo-600">View All Notifications</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
