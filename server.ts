import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import db from "./db.ts";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

app.use(express.json());

// --- Auth Middleware ---
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --- Gemini Setup ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function getEmbedding(text: string) {
  const result = await ai.models.embedContent({
    model: "text-embedding-004",
    contents: [{ parts: [{ text }] }]
  });
  return result.embeddings[0].values;
}

function cosineSimilarity(vecA: number[], vecB: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// --- API Routes ---

// Auth
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  // Default admin for demo: admin / admin123
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
    return res.json({ token, user: { username, role: "admin" } });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

// Stats
app.get("/api/stats", authenticate, (req, res) => {
  const docCount = db.prepare("SELECT COUNT(*) as count FROM documents").get() as any;
  const chunkCount = db.prepare("SELECT COUNT(*) as count FROM chunks").get() as any;
  const queryCount = db.prepare("SELECT COUNT(*) as count FROM queries").get() as any;
  const lastTrained = db.prepare("SELECT created_at FROM documents ORDER BY created_at DESC LIMIT 1").get() as any;

  res.json({
    totalDocuments: docCount.count,
    totalChunks: chunkCount.count,
    totalQueries: queryCount.count,
    lastTrained: lastTrained?.created_at || "Never",
  });
});

// History
app.get("/api/history", (req, res) => {
  const queries = db.prepare("SELECT * FROM queries ORDER BY created_at DESC LIMIT 50").all();
  res.json(queries);
});

// Documents
app.get("/api/documents", authenticate, (req, res) => {
  const docs = db.prepare("SELECT * FROM documents ORDER BY created_at DESC").all();
  res.json(docs);
});

app.delete("/api/documents/:id", authenticate, (req, res) => {
  db.prepare("DELETE FROM documents WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Upload & Process
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload", authenticate, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { originalname, buffer, size, mimetype } = req.file;
  const { category, impact } = req.body;
  
  try {
    // 1. Save doc record
    const info = db.prepare("INSERT INTO documents (name, type, size, status, category, impact) VALUES (?, ?, ?, ?, ?, ?)").run(
      originalname, mimetype, size, "processing", category || "Uncategorized", impact || "Low"
    );
    const docId = info.lastInsertRowid;

    // 2. Extract text
    let text = "";
    if (mimetype === "application/pdf") {
      const data = await pdf(buffer);
      text = data.text;
    } else {
      text = buffer.toString("utf-8");
    }

    // 3. Chunking (Simple implementation)
    const chunkSize = 1000;
    const overlap = 200;
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    // 4. Embed & Store
    for (const content of chunks) {
      if (content.trim().length < 10) continue;
      const embedding = await getEmbedding(content);
      db.prepare("INSERT INTO chunks (document_id, content, embedding) VALUES (?, ?, ?)").run(
        docId, content, Buffer.from(new Float32Array(embedding).buffer)
      );
    }

    db.prepare("UPDATE documents SET status = 'ready' WHERE id = ?").run(docId);
    res.json({ success: true, docId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
});

// Chat (RAG)
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const startTime = Date.now();

  try {
    // 1. Embed query (with fallback)
    let queryEmbedding: number[] | null = null;
    if (process.env.GEMINI_API_KEY) {
      try {
        queryEmbedding = await getEmbedding(message);
      } catch (e) {
        console.warn("Embedding failed, falling back to keyword search", e);
      }
    }

    // 2. Similarity search (or keyword fallback)
    const allChunks = db.prepare(`
      SELECT c.id, c.content, c.embedding, d.name as docName 
      FROM chunks c
      JOIN documents d ON c.document_id = d.id
    `).all() as any[];

    let topChunks: any[] = [];

    if (queryEmbedding && allChunks.length > 0 && allChunks[0].embedding) {
      const scoredChunks = allChunks.map(chunk => {
        const chunkVec = Array.from(new Float32Array(chunk.embedding.buffer, chunk.embedding.byteOffset, chunk.embedding.byteLength / 4));
        return {
          content: chunk.content,
          docName: chunk.docName,
          score: cosineSimilarity(queryEmbedding!, chunkVec)
        };
      });
      scoredChunks.sort((a, b) => b.score - a.score);
      topChunks = scoredChunks.slice(0, 5);
    } else {
      // Simple keyword fallback
      topChunks = allChunks
        .filter(c => c.content.toLowerCase().includes(message.toLowerCase().split(" ")[0]))
        .slice(0, 3)
        .map(c => ({ content: c.content, docName: c.docName }));
      
      if (topChunks.length === 0 && allChunks.length > 0) {
        topChunks = [allChunks[0]].map(c => ({ content: c.content, docName: c.docName }));
      }
    }

    const context = topChunks.map(c => c.content).join("\n\n");

    // 3. Generate Answer (with fallback)
    let answer = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{
            role: "user",
            parts: [{
              text: `
          You are the RBI Regulatory Assistant, a specialized AI for Reserve Bank of India guidelines and banking regulations.
          Your goal is to provide accurate, professional, and scannable information based on the provided context.
          
          Context:
          ${context || "No specific context found."}
          
          Question: ${message}
          
          Answer:
        `
            }]
          }]
        });
        answer = result.text;
      } catch (e) {
        console.error("Generation failed", e);
        answer = `Based on the documents in our repository, I found information related to your query. ${context ? "Specifically: " + context.slice(0, 200) + "..." : "However, I couldn't generate a detailed response at this moment."}`;
      }
    } else {
      answer = `[DEMO MODE] Based on the documents in our repository: ${context ? context.slice(0, 300) + "..." : "I found no specific information regarding your query. Please try uploading more documents."}`;
    }

    // 4. Log query
    db.prepare("INSERT INTO queries (question, answer, response_time) VALUES (?, ?, ?)").run(
      message, answer, Date.now() - startTime
    );

    res.json({ 
      answer, 
      sources: topChunks.map(c => ({ name: c.docName, content: c.content.slice(0, 100) + "..." })),
      responseTime: Date.now() - startTime
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
