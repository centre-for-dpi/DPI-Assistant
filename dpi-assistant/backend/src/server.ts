import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { VectorStore } from './services/vectorStore';
import { EmbeddingService } from './utils/embeddings';

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

// Initialize Vector Store and Embedding Service
// Dynamic Qdrant URL configuration:
// - Local dev: http://localhost:6333 (default)
// - Docker Compose: http://qdrant:6333 (use service name)
// - Production: https://your-cluster.qdrant.io:6333 (Qdrant Cloud)
const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
const useVectorSearch = process.env.USE_VECTOR_SEARCH !== 'false'; // Default to true
let vectorStore: VectorStore | null = null;
let embeddingService: EmbeddingService | null = null;

// Initialize vector services if enabled
async function initializeVectorServices() {
  if (!useVectorSearch) {
    console.log('⚠️  Vector search disabled');
    return;
  }

  try {
    vectorStore = new VectorStore(qdrantUrl);
    embeddingService = new EmbeddingService(apiKey);

    // Check if collection exists
    const collectionInfo = await vectorStore.getCollectionInfo();
    if (collectionInfo) {
      console.log(`✅ Vector store connected: ${collectionInfo.points_count} vectors`);
    } else {
      console.log('⚠️  Vector store collection not found. Run: npm run populate-vectors');
    }
  } catch (error) {
    console.error('⚠️  Vector store connection failed:', error);
    console.log('   Falling back to full knowledge base mode');
    vectorStore = null;
    embeddingService = null;
  }
}

// Load knowledge base - NOW LOADS ALL FILES COMPLETELY
function loadKnowledgeBase(): string {
  try {
    const kbPath = path.join(__dirname, '..', 'content', 'knowledge-base');
    if (!fs.existsSync(kbPath)) {
      console.warn('Knowledge base directory not found');
      return 'DPI Knowledge Base: Digital Public Infrastructure (DPI) consists of foundational digital systems.';
    }

    const files = fs.readdirSync(kbPath);
    let knowledgeBase = '';

    // Priority files loaded first
    const priorityFiles = [
      '[DPI GPT assistant] Strategy notes + context compilation.md',
      '[DPI GPT assistant] - Africa Strategy notes + context compilation (1).md',
      'Centre for Digital Public Infrastructure.md',
      'DPI for Healthcare.md',
      'G2P Connect.md'
    ];

    // Load priority files
    for (const priorityFile of priorityFiles) {
      if (files.includes(priorityFile)) {
        const content = fs.readFileSync(path.join(kbPath, priorityFile), 'utf-8');
        knowledgeBase += `\n\n--- PRIORITY: ${priorityFile} ---\n${content}`;
      }
    }

    // Load all other markdown files
    for (const file of files) {
      if (file.endsWith('.md') && !priorityFiles.includes(file)) {
        const content = fs.readFileSync(path.join(kbPath, file), 'utf-8');
        knowledgeBase += `\n\n--- ${file} ---\n${content}`;
      }
    }

    console.log(`✅ Knowledge base loaded: ${files.filter(f => f.endsWith('.md')).length} files, ${knowledgeBase.length} characters`);
    return knowledgeBase;
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return 'DPI Knowledge Base: Digital Public Infrastructure (DPI) consists of foundational digital systems.';
  }
}

const knowledgeBase = loadKnowledgeBase();

// Load prompt templates - LOADS ALL PROMPTS
function loadPromptTemplate(filename: string): string {
  try {
    const promptPath = path.join(__dirname, '..', 'content', 'prompts', filename);
    if (!fs.existsSync(promptPath)) {
      console.warn(`⚠️  Prompt template not found: ${filename}`);
      return '';
    }
    const content = fs.readFileSync(promptPath, 'utf-8');
    console.log(`✅ Loaded prompt template: ${filename} (${content.length} characters)`);
    return content;
  } catch (error) {
    console.error(`❌ Error loading prompt template ${filename}:`, error);
    return '';
  }
}

// Template variable replacement - Supports {{{variable}}} and {{#if}} syntax
function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  let result = template;

  // Handle {{{variable}}} syntax (triple braces)
  for (const [key, value] of Object.entries(variables)) {
    const tripleRegex = new RegExp(`\\{\\{\\{${key}\\}\\}\\}`, 'g');
    result = result.replace(tripleRegex, value || '');
  }

  // Handle {{#if variable}}...{{/if}} conditional blocks
  result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, varName, content) => {
    return variables[varName] ? content : '';
  });

  return result;
}

// Load all prompt templates at startup
const answerPromptTemplate = loadPromptTemplate('answer-dpi-questions-prompt.md');
const suggestDPIsPromptTemplate = loadPromptTemplate('suggest-relevant-dpis-prompt.md');
const summarizeDocumentPromptTemplate = loadPromptTemplate('summarize-documents-prompt.md');

// Create Gemini model
function createModel() {
  return genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
}

// Retrieve relevant context using vector search or fallback to full KB
async function retrieveContext(query: string): Promise<string> {
  // If vector search is available, use it
  if (vectorStore && embeddingService) {
    try {
      const queryEmbedding = await embeddingService.generateEmbedding(query);
      const results = await vectorStore.search(queryEmbedding, 10, 0.65);

      if (results.length > 0) {
        const context = results
          .map(result => `[Source: ${result.metadata.source}]\n${result.text}`)
          .join('\n\n---\n\n');

        console.log(`🔍 Vector search: Found ${results.length} relevant chunks`);
        return context;
      }
    } catch (error) {
      console.error('Vector search error, falling back to full KB:', error);
    }
  }

  // Fallback: Use first 100KB of knowledge base
  console.log('📚 Using full knowledge base (limited to 100KB)');
  return knowledgeBase.substring(0, 100000);
}

// Health check endpoint
app.get('/health', async (req, res) => {
  let vectorStoreStatus = 'disabled';
  let vectorCount = 0;

  if (vectorStore) {
    try {
      const info = await vectorStore.getCollectionInfo();
      vectorStoreStatus = info ? 'connected' : 'not_initialized';
      vectorCount = info?.points_count || 0;
    } catch {
      vectorStoreStatus = 'error';
    }
  }

  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    knowledgeBaseSize: knowledgeBase.length,
    vectorStore: {
      status: vectorStoreStatus,
      vectors: vectorCount
    },
    promptsLoaded: {
      answer: answerPromptTemplate.length > 0,
      suggest: suggestDPIsPromptTemplate.length > 0,
      summarize: summarizeDocumentPromptTemplate.length > 0
    }
  });
});

// Main chat endpoint - Uses answer-dpi-questions-prompt.md
app.post('/chat', async (req, res) => {
  try {
    const { message, chatHistoryArray, persona } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Use the sophisticated prompt if available, fallback to simple prompt
    if (!answerPromptTemplate) {
      return res.status(500).json({ error: 'Answer prompt template not loaded' });
    }

    // Build chat history
    let chatHistory = '';
    if (chatHistoryArray && Array.isArray(chatHistoryArray)) {
      chatHistory = chatHistoryArray
        .map((m: any) => `${m.sender}: ${m.text || m.answer}`)
        .join('\n');
    }

    // Retrieve relevant context using vector search or fallback
    const relevantContext = await retrieveContext(message);

    // Replace template variables
    const prompt = replaceTemplateVariables(answerPromptTemplate, {
      question: message,
      knowledgeBase: relevantContext,
      chatHistory: chatHistory,
      persona: persona || ''
    });

    // Create model instance
    const model = createModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    const answer = response.text();

    res.json({
      id: randomUUID(),
      sender: 'assistant',
      answer,
      sources: [], // Sources hidden as requested
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

// DPI Suggestions endpoint - Uses suggest-relevant-dpis-prompt.md
app.post('/suggest-dpis', async (req, res) => {
  try {
    const { useCase, context, country } = req.body;

    if (!useCase || typeof useCase !== 'string') {
      return res.status(400).json({ error: 'Use case is required' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    if (!suggestDPIsPromptTemplate) {
      return res.status(500).json({ error: 'DPI suggestions prompt template not loaded' });
    }

    // Replace template variables
    const prompt = replaceTemplateVariables(suggestDPIsPromptTemplate, {
      useCase: useCase,
      additionalContext: context || '',
      countryContext: country || '',
      knowledgeBase: knowledgeBase
    });

    const model = createModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawAnswer = response.text();

    res.json({
      id: randomUUID(),
      suggestions: rawAnswer,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in suggest-dpis endpoint:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

// Document Summarization endpoint - Uses summarize-documents-prompt.md
app.post('/summarize', async (req, res) => {
  try {
    const { documentContent, documentTitle } = req.body;

    if (!documentContent || typeof documentContent !== 'string') {
      return res.status(400).json({ error: 'Document content is required' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    if (!summarizeDocumentPromptTemplate) {
      return res.status(500).json({ error: 'Summarize prompt template not loaded' });
    }

    // Replace template variables
    const prompt = replaceTemplateVariables(summarizeDocumentPromptTemplate, {
      documentContent: documentContent,
      documentTitle: documentTitle || 'Untitled Document'
    });

    const model = createModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text();

    res.json({
      id: randomUUID(),
      summary,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in summarize endpoint:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

// Feedback endpoint (NO AUTHENTICATION REQUIRED)
app.post('/feedback', (req, res) => {
  const { messageId, feedback } = req.body;
  console.log(`Feedback received for message ${messageId}: ${feedback}`);
  res.json({ success: true, message: 'Feedback received' });
});

// Start server
async function startServer() {
  // Initialize vector services
  await initializeVectorServices();

  app.listen(port, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 DPI Sage backend running on port ${port}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📚 Knowledge Base: ${knowledgeBase.length.toLocaleString()} characters`);
    console.log(`📝 Prompts Loaded:`);
    console.log(`   - answer-dpi-questions: ${answerPromptTemplate ? '✅' : '❌'} (${answerPromptTemplate.length} chars)`);
    console.log(`   - suggest-relevant-dpis: ${suggestDPIsPromptTemplate ? '✅' : '❌'} (${suggestDPIsPromptTemplate.length} chars)`);
    console.log(`   - summarize-documents: ${summarizeDocumentPromptTemplate ? '✅' : '❌'} (${summarizeDocumentPromptTemplate.length} chars)`);
    console.log(`🔍 Retrieval: ${vectorStore ? 'Vector Search (Semantic)' : 'Full KB (Limited to 100KB)'}`);
    console.log(`⚠️  WARNING: Running without authentication`);
    console.log(`${'='.repeat(60)}\n`);
  });
}

startServer();
