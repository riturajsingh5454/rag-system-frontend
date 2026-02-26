import React, { useState, useEffect } from 'react';
import { 
  FileUp, 
  Database, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  MoreVertical,
  Filter,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { UploadDropzone } from '@/src/components/user/UploadDropzone';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { UploadedFile } from '@/src/types';
import { APP_CONFIG } from '@/src/constants';

export default function UserUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [category, setCategory] = useState('General');
  const [impact, setImpact] = useState('Low');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/documents', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setFiles(data.map((d: any) => ({
        id: d.id.toString(),
        name: d.name,
        size: d.size,
        status: d.status,
        progress: 100,
        category: d.category,
        impact: d.impact,
        timestamp: d.created_at
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('impact', impact);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });

      if (response.ok) {
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          fetchFiles();
        }, 500);
      }
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const deleteFile = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-12 space-y-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Knowledge Center</h1>
          <p className="text-slate-500 text-lg">Upload and manage documents for your AI assistant.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-2">
            <Database size={16} className="text-indigo-600" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Storage: 1.2GB / 10GB</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Metadata Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
                >
                  <option>General</option>
                  <option>Regulatory</option>
                  <option>Compliance</option>
                  <option>Master Circular</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Impact Level</label>
                <select 
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ingestion Zone</h3>
            <UploadDropzone 
              onUpload={handleUpload} 
              isUploading={isUploading} 
              progress={uploadProgress} 
            />
          </div>

          <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl">
            <h4 className="font-bold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-indigo-400" />
              Processing Pipeline
            </h4>
            <ul className="space-y-3">
              {[
                "OCR & Text Extraction",
                "Semantic Chunking",
                "Vector Embedding Generation",
                "Knowledge Graph Linking"
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-3 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Indexed Documents</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input placeholder="Search files..." className="pl-9 h-9 text-xs w-48 rounded-lg" />
              </div>
              <Button variant="outline" size="sm" className="h-9 rounded-lg">
                <Filter size={14} className="mr-2" /> Filter
              </Button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest px-6">File Name</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Size</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <FileUp size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{file.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Clock size={10} className="text-slate-400" />
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                              {new Date(file.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={file.status === 'ready' ? 'default' : 'outline'} className="rounded-lg text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
                        {file.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => deleteFile(file.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {files.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-20 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                        <FileUp size={24} />
                      </div>
                      <p className="text-slate-500 font-medium">No documents uploaded yet.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
