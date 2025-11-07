import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
const port = process.env.PORT || 8080;

// CORS configuration
const corsOptions = {
  origin: [
    'https://assistant.cdpi.dev',
    'http://assistant.cdpi.dev',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://3.6.69.157',
    'https://3.6.69.157'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
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

// Chat endpoint (NO AUTHENTICATION REQUIRED)
app.post('/chat', async (req, res) => {
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

Instructions:
- Provide a helpful, accurate response about Digital Public Infrastructure in plain text
- If the answer is in the knowledge base, reference it naturally in your response
- If not, provide general guidance based on DPI principles
- Do NOT use any markdown formatting whatsoever in your response
- Do NOT include a "Sources", "References", or "Related Material" section
- Do NOT repeat the user's question in your response
- Do NOT include examples of questions or prompts at the end
- Keep your answer concise, clear, and in plain text format only`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawAnswer = response.text();

    // Clean the response to remove markdown and unwanted content
    const answer = cleanResponse(rawAnswer);

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

// Function to clean response from markdown and unwanted content
function cleanResponse(text: string): string {
  let cleaned = text;

  // Remove sources/references sections completely
  cleaned = cleaned.replace(/(?:Sources?|References?|Related Materials?|Further Reading):\s*\n[\s\S]*?(?=\n\n|$)/gi, '');

  // Remove markdown headings (###, ##, #)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

  // Remove bold markdown (**text** or __text__)
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
  cleaned = cleaned.replace(/__(.*?)__/g, '$1');

  // Remove italic markdown (*text* or _text_) - but be careful not to break lists
  cleaned = cleaned.replace(/\b\*(.*?)\*\b/g, '$1');
  cleaned = cleaned.replace(/\b_(.*?)_\b/g, '$1');

  // Remove markdown lists (- or * at start of line)
  cleaned = cleaned.replace(/^[\-\*]\s+/gm, '');

  // Remove code blocks (```...```)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

  // Remove inline code (`...`)
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // Remove markdown links [text](url)
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

  // Remove ONLY trailing example/question sections (at the end of response)
  cleaned = cleaned.replace(/\n\n(?:Example|Examples|Question|Questions):\s*[\s\S]*$/gi, '');

  // Clean up excessive newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

// Feedback endpoint (NO AUTHENTICATION REQUIRED)
app.post('/feedback', (req, res) => {
  const { messageId, feedback } = req.body;
  console.log(`Feedback received for message ${messageId}: ${feedback}`);
  res.json({ success: true, message: 'Feedback received' });
});

// Start server
app.listen(port, () => {
  console.log(`DPI Sage backend running on port ${port}`);
  console.log(`Knowledge base loaded: ${knowledgeBase.length} characters`);
  console.log(`⚠️  WARNING: Running without authentication`);
});
