import React from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Moon, 
  Sun, 
  Trash2, 
  Bell, 
  Database,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Separator } from '@/src/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { APP_CONFIG } from '@/src/constants';

export default function UserSettings() {
  return (
    <div className="flex-1 p-6 md:p-12 space-y-12 max-w-4xl mx-auto w-full">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-lg">Manage your account preferences and system configuration.</p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Account Profile</h3>
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                  <User size={40} />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-xl font-bold text-slate-900">John Doe</h4>
                  <p className="text-slate-500 flex items-center gap-2">
                    <Mail size={14} /> john.doe@enterprise.com
                  </p>
                  <div className="pt-2">
                    <span className="px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">
                      Enterprise Pro
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="rounded-xl" onClick={() => alert('Profile updated!')}>Save Changes</Button>
                  <Button variant="ghost" className="rounded-xl text-xs">Edit Profile</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Preferences Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Moon, title: "Dark Mode", desc: "Switch to dark theme", action: <Button variant="outline" size="sm" className="rounded-lg"><Sun size={14} className="mr-2" /> Light</Button> },
              { icon: Bell, title: "Notifications", desc: "Manage email alerts", action: <Button variant="outline" size="sm" className="rounded-lg">Configure</Button> },
              { icon: Database, title: "Storage Plan", desc: "1.2GB of 10GB used", action: <Button variant="outline" size="sm" className="rounded-lg text-indigo-600 border-indigo-200">Upgrade</Button> },
              { icon: Shield, title: "Privacy", desc: "Manage data sharing", action: <Button variant="outline" size="sm" className="rounded-lg">Settings</Button> },
            ].map((item, i) => (
              <Card key={i} className="border-slate-200 hover:border-indigo-200 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  {item.action}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Security & Data</h3>
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                <button className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Change Password</p>
                      <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </button>
                <button 
                  onClick={() => {
                    if(confirm('Are you sure you want to clear all history?')) {
                      alert('History cleared successfully.');
                    }
                  }}
                  className="w-full p-6 flex items-center justify-between hover:bg-red-50 group transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
                      <Trash2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">Clear All History</p>
                      <p className="text-xs text-slate-500">Permanently delete all chat logs</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-red-300 transition-colors" />
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="pt-8 flex justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            {APP_CONFIG.name} Platform v{APP_CONFIG.version} • Enterprise Edition
          </p>
        </div>
      </div>
    </div>
  );
}
