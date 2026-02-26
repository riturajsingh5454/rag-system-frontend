export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Source[];
  responseTime?: number;
}

export interface Source {
  id: string;
  title: string;
  content: string;
  url?: string;
}

export interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  responseTime: number;
  sources: Source[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
  category: string;
  impact: string;
  timestamp: string;
}
