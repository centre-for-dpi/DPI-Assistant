import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { verifyToken } from './middleware/auth';

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const apiKey = process.env.GOOGLE_AI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Load knowledge base
function loadKnowledgeBase(): string {
  try {
    const kbPath = path.join(__dirname, '..', 'content', 'knowledge-base');
    if (!fs.existsSync(kbPath)) {
      console.warn('Knowledge base directory not found');
      return 'DPI Knowledge Base: Digital Public Infrastructure (DPI) consists of foundational digital systems.';
    }

    const files = fs.readdirSync(kbPath);
    let knowledgeBase = '';

    const priorityFiles = [
      '[DPI GPT assistant] Strategy notes + context compilation.md',
      '[DPI GPT assistant] - Africa Strategy notes + context compilation (1).md',
      'Centre for Digital Public Infrastructure.md',
      'DPI for Healthcare.md',
      'G2P Connect.md'
    ];

    for (const priorityFile of priorityFiles) {
      if (files.includes(priorityFile)) {
        const content = fs.readFileSync(path.join(kbPath, priorityFile), 'utf-8');
        knowledgeBase += `\n\n--- PRIORITY: ${priorityFile} ---\n${content}`;
      }
    }

    for (const file of files) {
      if (file.endsWith('.md') && !priorityFiles.includes(file)) {
        const content = fs.readFileSync(path.join(kbPath, file), 'utf-8');
        knowledgeBase += `\n\n--- ${file} ---\n${content}`;
      }
    }

    return knowledgeBase;
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return 'DPI Knowledge Base: Digital Public Infrastructure (DPI) consists of foundational digital systems.';
  }
}

const knowledgeBase = loadKnowledgeBase();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

// Chat endpoint (protected)
app.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message, chatHistoryArray } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

    // Build context
    let chatHistory = '';
    if (chatHistoryArray && Array.isArray(chatHistoryArray)) {
      chatHistory = chatHistoryArray
        .map((m: any) => `${m.sender}: ${m.text || m.answer}`)
        .join('\n');
    }

    const prompt = `You are DPI Sage, an AI assistant specialized in Digital Public Infrastructure (DPI).

Context from Knowledge Base:
${knowledgeBase.substring(0, 30000)}

${chatHistory ? `Previous conversation:\n${chatHistory}\n\n` : ''}

User question: ${message}

Please provide a helpful, accurate response about Digital Public Infrastructure. If the answer is in the knowledge base, reference it. If not, provide general guidance based on DPI principles.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const answer = response.text();

    res.json({
      id: randomUUID(),
      sender: 'assistant',
      answer,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Feedback endpoint (protected)
app.post('/feedback', verifyToken, (req, res) => {
  const { messageId, feedback } = req.body;
  console.log(`Feedback received for message ${messageId}: ${feedback}`);
  res.json({ success: true, message: 'Feedback received' });
});

// Start server
app.listen(port, () => {
  console.log(`DPI Sage backend running on port ${port}`);
  console.log(`Knowledge base loaded: ${knowledgeBase.length} characters`);
});
