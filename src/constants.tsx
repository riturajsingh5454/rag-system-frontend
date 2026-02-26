import React from 'react';
import { Database, ShieldCheck, FileText, LayoutDashboard, History, Upload, Settings } from 'lucide-react';

export const APP_CONFIG = {
  name: 'Nexus Regulatory AI',
  shortName: 'Nexus AI',
  version: '1.0.0',
  adminEmail: 'admin@nexus-regulatory.com',
  supportEmail: 'support@nexus-regulatory.com',
};

export const NAV_ITEMS = {
  user: [
    { icon: LayoutDashboard, label: 'Assistant', path: '/' },
    
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Upload, label: 'Ingestion', path: '/admin/upload' },
    { icon: FileText, label: 'Repository', path: '/admin/documents' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ]
};

export const MOCK_DATA = {
  alerts: [
    { id: 1, title: 'New KYC Amendment', date: '2 hours ago', impact: 'High', description: 'Mandatory re-verification for high-risk accounts.' },
    { id: 2, title: 'Repo Rate Update', date: '5 hours ago', impact: 'Medium', description: 'Unchanged at 6.50% for the current quarter.' },
    { id: 3, title: 'UPI Transaction Limits', date: '1 day ago', impact: 'Low', description: 'Increased limits for educational and hospital payments.' },
  ],
  stats: {
    totalDocuments: 154,
    totalChunks: 45200,
    totalQueries: 12840,
    complianceScore: '94%',
    criticalUpdates: 3
  }
};
