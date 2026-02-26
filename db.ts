import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('rag.db');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'admin'
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    status TEXT DEFAULT 'processing',
    size INTEGER,
    category TEXT,
    impact TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id INTEGER,
    content TEXT,
    embedding BLOB,
    metadata TEXT,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT,
    response_time INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Ensure columns exist for existing databases
try {
  db.exec("ALTER TABLE documents ADD COLUMN category TEXT;");
} catch (e) {}
try {
  db.exec("ALTER TABLE documents ADD COLUMN impact TEXT;");
} catch (e) {}

// Seed data if empty
const docCount = db.prepare("SELECT COUNT(*) as count FROM documents").get() as any;
if (docCount.count === 0) {
  const docId = db.prepare("INSERT INTO documents (name, type, status, size, category, impact) VALUES (?, ?, ?, ?, ?, ?)").run(
    "RBI_Master_Circular_2024.pdf", "application/pdf", "ready", 1024567, "Regulatory", "High"
  ).lastInsertRowid;

  db.prepare("INSERT INTO chunks (document_id, content) VALUES (?, ?)").run(
    docId, "The Reserve Bank of India (RBI) has updated the Master Circular on KYC norms for 2024. Key changes include mandatory periodic updation of KYC for high-risk customers every 2 years."
  );
  
  db.prepare("INSERT INTO queries (question, answer, response_time) VALUES (?, ?, ?)").run(
    "What are the new KYC norms for 2024?", 
    "According to the RBI Master Circular 2024, high-risk customers must update their KYC every 2 years. Low-risk customers can update every 10 years.",
    450
  );
}

export default db;
