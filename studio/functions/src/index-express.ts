// Express.js version of Firebase Functions
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ChatResponse {
  id: string;
  sender: "assistant";
  answer?: string;
  sources?: string[];
  suggestedDPIs?: Array<{ name: string; relevance: string }>;
  reasoning?: string;
  error?: string;
  timestamp: number;
}

// Load knowledge base content with priority for important documents
function loadKnowledgeBase(): string {
  try {
    const kbPath = path.join(__dirname, '..', 'content', 'knowledge-base');
    const files = fs.readdirSync(kbPath);
    let knowledgeBase = '';
    
    // Priority order: Most important documents first (all priority docs equal)
    const priorityFiles = [
      '[DPI GPT assistant] Strategy notes + context compilation.md',
      '[DPI GPT assistant] - Africa Strategy notes + context compilation (1).md',
      'Centre for Digital Public Infrastructure.md',
      'DPI for Healthcare.md', 
      'G2P Connect.md'
    ];
    
    // First, add the priority files
    for (const priorityFile of priorityFiles) {
      if (files.includes(priorityFile)) {
        const content = fs.readFileSync(path.join(kbPath, priorityFile), 'utf-8');
        knowledgeBase += `\n\n--- PRIORITY: ${priorityFile} ---\n${content}`;
      }
    }
    
    // Then add all other files
    for (const file of files) {
      if (file.endsWith('.md') && !priorityFiles.includes(file)) {
        const content = fs.readFileSync(path.join(kbPath, file), 'utf-8');
        knowledgeBase += `\n\n--- ${file} ---\n${content}`;
      }
    }
    
    return knowledgeBase;
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return 'DPI Knowledge Base: Digital Public Infrastructure (DPI) consists of foundational digital systems that enable countries to deliver services to their citizens efficiently and inclusively.';
  }
}

// Load prompt template
function loadPrompt(promptName: string): string {
  try {
    const promptPath = path.join(__dirname, '..', 'content', 'prompts', `${promptName}.md`);
    return fs.readFileSync(promptPath, 'utf-8');
  } catch (error) {
    console.error(`Error loading prompt ${promptName}:`, error);
    return '';
  }
}

// Import the new vector store
import { getVectorStore } from './lib/vectorStore';

// DEPRECATED: Legacy keyword-based extraction - keeping as fallback
function extractRelevantSections(knowledgeBase: string, keywords: string[]): string {
  console.warn('Using deprecated keyword-based extraction as fallback');
  const sections = knowledgeBase.split('\n\n---');
  let relevantContent = '';
  
  for (const section of sections) {
    const sectionLower = section.toLowerCase();
    
    for (const keyword of keywords) {
      if (sectionLower.includes(keyword.toLowerCase())) {
        const lines = section.split('\n');
        let title = lines[0] || '';
        title = title.replace(/.*PRIORITY:\s*/, '').replace(/^---\s*/, '').replace(/\s*---$/, '').trim();
        const content = lines.slice(1, 15).join('\n').trim();
        
        if (content) {
          relevantContent += `\n\n**${title}**\n${content}`;
        }
        break;
      }
    }
  }
  
  return relevantContent.substring(0, 8000) || 'No specific information found in the knowledge base for this topic.';
}

import { queryProcessor } from './lib/queryProcessor';
import { dpiOntology } from './lib/dpiOntology';
import { queryAnalytics } from './lib/queryAnalytics';
import { getSimpleVectorStore } from './lib/simpleVectorStore';

// NEW: Semantic search-based content retrieval
async function getRelevantContextSemantic(query: string): Promise<string> {
  try {
    console.log(`Getting semantic context for query: "${query}"`);
    
    // SIMPLIFIED APPROACH: Try direct search first
    const simpleStore = await getSimpleVectorStore();
    let context = await simpleStore.search(query, 15);
    
    // If we got good results, return them
    if (context.length > 500 && !context.includes('No relevant information')) {
      console.log(`Direct search successful, returning ${context.length} chars`);
      return context;
    }
    
    // Only if direct search fails, use the complex approach
    console.log('Direct search insufficient, trying enhanced search...');
    
    // Use intelligent query processor
    const processedQuery = queryProcessor.processQuery(query);
    console.log(`Processed query:`, {
      intent: processedQuery.intent,
      entities: processedQuery.entities,
      confidence: processedQuery.confidence
    });
    
    // Use the enhanced query from the processor
    const enhancedQuery = processedQuery.enhanced;
    console.log(`Enhanced query: "${enhancedQuery}"`);
    
    const vectorStore = await getVectorStore();
    
    // Get main results
    context = await vectorStore.getRelevantContext(enhancedQuery, 10000);
    
    // If low confidence or few results, try alternative queries
    if (processedQuery.confidence < 0.7 || context.length < 500) {
      console.log('Low confidence or few results, trying alternative queries...');
      const alternatives = queryProcessor.generateAlternativeQueries(query);
      
      for (const altQuery of alternatives.slice(1)) { // Skip original
        const altContext = await vectorStore.getRelevantContext(altQuery, 5000);
        if (altContext.length > 100 && !altContext.includes('No relevant information')) {
          context += '\n\n' + altContext;
        }
      }
    }
    
    // Log query for analytics (async, don't wait)
    queryAnalytics.logQuery(query, processedQuery, context.length).catch(err => 
      console.error('Analytics logging error:', err)
    );
    
    return context;
  } catch (error) {
    console.error('Error with semantic search, falling back to keyword search:', error);
    
    // Enhanced fallback using ontology
    const knowledgeBase = loadKnowledgeBase();
    const ontologyExpansion = dpiOntology.expandQuery(query);
    const allKeywords = [...new Set([
      ...query.toLowerCase().split(' ').filter(word => word.length > 3),
      ...ontologyExpansion.terms
    ])];
    
    return extractRelevantSections(knowledgeBase, allKeywords);
  }
}

// Answer DPI questions using Gemini AI grounded in knowledge base
async function answerDPIQuestion(question: string, persona: string = 'Default', chatHistory?: string): Promise<{ answer: string; sources: string[] }> {
  try {
    // Load prompt template
    const promptTemplate = loadPrompt('answer-dpi-questions-prompt');
    
    if (!promptTemplate) {
      throw new Error('Failed to load prompt template');
    }
    
    // Use semantic search to find relevant content
    console.log(`Processing DPI question: "${question}"`);
    
    // Check if we have sufficient context
    let relevantSections = await getRelevantContextSemantic(question);
    console.log(`Retrieved context length: ${relevantSections.length} characters`);
    
    // If no relevant content found, use broader search
    if (relevantSections.length < 100 || relevantSections.includes('No relevant information found')) {
      console.log('Insufficient context found, trying broader search...');
      const fallbackSections = await getRelevantContextSemantic(`DPI digital public infrastructure ${question}`);
      if (fallbackSections.length > relevantSections.length) {
        console.log('Using broader search results');
        relevantSections = fallbackSections;
      }
    }
    
    // Initialize Gemini AI
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('Google AI API key not configured');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    // Create grounded prompt using the proper prompt template with conditional sections
    let filledPrompt = promptTemplate
      .replace(/{{{question}}}/g, question)
      .replace(/{{{persona}}}/g, persona)
      .replace(/{{{knowledgeBase}}}/g, relevantSections);
    
    // Handle conditional sections
    if (chatHistory && chatHistory.trim()) {
      filledPrompt = filledPrompt
        .replace(/{{#if chatHistory}}/g, '')
        .replace(/{{\/if}}/g, '')
        .replace(/{{{chatHistory}}}/g, chatHistory);
    } else {
      // Remove the conditional chat history section if no history
      filledPrompt = filledPrompt.replace(/{{#if chatHistory}}[\s\S]*?{{\/if}}/g, '');
    }
    
    // Handle persona conditional
    if (persona && persona !== 'Default') {
      filledPrompt = filledPrompt
        .replace(/{{#if persona}}/g, '')
        .replace(/{{\/if}}/g, '');
    } else {
      // Remove the conditional persona section if default
      filledPrompt = filledPrompt.replace(/{{#if persona}}[\s\S]*?{{\/if}}/g, '');
    }
    
    const groundedPrompt = filledPrompt;

    // Generate response using Gemini
    const result = await model.generateContent(groundedPrompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Try to parse JSON response first, fallback to plain text
    let answer = responseText;
    let sources = ['DPI Knowledge Base'];
    
    try {
      // Look for JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonResponse = JSON.parse(jsonMatch[0]);
        if (jsonResponse.answer) {
          answer = jsonResponse.answer;
        }
        if (jsonResponse.sources && Array.isArray(jsonResponse.sources)) {
          sources = [...sources, ...jsonResponse.sources];
        }
      }
    } catch (parseError) {
      // If JSON parsing fails, use the response as-is
      console.log('Response is not JSON, using as plain text');
    }
    
    // Add specific sources based on knowledge base content
    if (relevantSections.includes('Centre for Digital Public Infrastructure')) {
      sources.push('Centre for Digital Public Infrastructure');
    }
    if (relevantSections.includes('DPI for Healthcare')) {
      sources.push('DPI for Healthcare');
    }
    if (relevantSections.includes('G2P Connect')) {
      sources.push('G2P Connect');
    }
    
    return {
      answer: answer,
      sources: sources
    };
    
  } catch (error) {
    console.error('Error in answerDPIQuestion:', error);
    
    // Fallback to knowledge base content if AI fails
    const knowledgeBase = loadKnowledgeBase();
    const questionWords = question.toLowerCase().split(' ').filter(word => word.length > 3);
    const relevantSections = extractRelevantSections(knowledgeBase, questionWords);
    
    if (relevantSections.length > 100) {
      return {
        answer: `Based on the knowledge base content, here's what I found relevant to your question:

${relevantSections}

This information comes directly from the uploaded knowledge base. For additional resources, please refer to the documentation at: https://docs.cdpi.dev/`,
        sources: ['DPI Knowledge Base']
      };
    }
    
    return {
      answer: 'I apologize, but I encountered an error while processing your question. Please try again.',
      sources: ['DPI Knowledge Base']
    };
  }
}

// Suggest relevant DPIs using knowledge base analysis
async function suggestRelevantDPIs(countryContext: string): Promise<{ suggestedDPIs: Array<{ name: string; relevance: string }>; reasoning: string }> {
  try {
    const context = countryContext.toLowerCase();
    const suggestions = [];
    
    // Analyze context and suggest relevant DPIs based on knowledge base
    if (context.includes('identity') || context.includes('id') || context.includes('authentication') || context.includes('citizen')) {
      suggestions.push({
        name: 'Foundational Digital Identity System',
        relevance: 'Provides unique, verifiable identification for citizens, enabling secure access to services and supporting other DPI layers.'
      });
    }
    
    if (context.includes('payment') || context.includes('financial') || context.includes('banking') || context.includes('economic')) {
      suggestions.push({
        name: 'Interoperable Digital Payments Infrastructure',
        relevance: 'Enables secure financial transactions, promotes financial inclusion, and supports economic development.'
      });
    }
    
    if (context.includes('data') || context.includes('information') || context.includes('sharing') || context.includes('privacy')) {
      suggestions.push({
        name: 'Consent-Based Data Exchange System',
        relevance: 'Enables secure, user-controlled data sharing while maintaining privacy and supporting innovation.'
      });
    }
    
    if (context.includes('government') || context.includes('public service') || context.includes('service delivery')) {
      suggestions.push({
        name: 'Digital Service Delivery Platform',
        relevance: 'Provides unified access to government services, improving efficiency and citizen experience.'
      });
    }
    
    if (context.includes('agriculture') || context.includes('farming') || context.includes('rural')) {
      suggestions.push({
        name: 'Agriculture Digital Infrastructure',
        relevance: 'Enables market access for farmers, better pricing, and access to financial services and insurance.'
      });
    }
    
    if (context.includes('education') || context.includes('learning') || context.includes('school')) {
      suggestions.push({
        name: 'Education Digital Infrastructure',
        relevance: 'Provides personalized learning, assessment systems, and governance tools for education transformation.'
      });
    }
    
    if (context.includes('health') || context.includes('medical') || context.includes('healthcare')) {
      suggestions.push({
        name: 'Healthcare Digital Infrastructure',
        relevance: 'Enables secure health data sharing, telemedicine, and improved healthcare service delivery.'
      });
    }
    
    // Default suggestions if no specific context is detected
    if (suggestions.length === 0) {
      suggestions.push(
        {
          name: 'Foundational Digital Identity',
          relevance: 'Essential for secure digital services and citizen identification.'
        },
        {
          name: 'Digital Payments Infrastructure',
          relevance: 'Enables financial inclusion and economic development.'
        },
        {
          name: 'Data Exchange Framework',
          relevance: 'Facilitates secure, consent-based information sharing.'
        }
      );
    }
    
    return {
      suggestedDPIs: suggestions,
      reasoning: 'These suggestions are based on your country\'s context and align with DPI best practices for building foundational digital infrastructure that can support multiple services and promote inclusive development. The recommendations follow the DPI approach of creating reusable, interoperable building blocks that can be leveraged across multiple sectors.'
    };
  } catch (error) {
    console.error('Error in suggestRelevantDPIs:', error);
    return {
      suggestedDPIs: [
        { name: "Foundational Digital Identity", relevance: "Essential for secure digital services and citizen identification." },
        { name: "Digital Payments Infrastructure", relevance: "Enables financial inclusion and economic development." },
        { name: "Data Exchange Framework", relevance: "Facilitates secure, consent-based information sharing." }
      ],
      reasoning: "These suggestions are based on your country's context and align with DPI best practices for building foundational digital infrastructure that can support multiple services and promote inclusive development."
    };
  }
}

// Express-compatible handler functions
export const chat = async (req: any, res: any) => {
  try {
    const { message, chatHistoryArray, persona } = req.body;
    
    const uniqueId = randomUUID();
    
    // Check if this is a suggestion query
    const isSuggestionQuery = /(suggest|recommend).*(dpi|digital public infrastructure|digital infrastructure|solutions?)/i.test(message.toLowerCase());

    if (isSuggestionQuery) {
      // Generate DPI suggestions based on context
      const context = chatHistoryArray ? chatHistoryArray.map((m: any) => `${m.sender}: ${m.text}`).join('\n') + '\nUser: ' + message : message;
      const suggestions = await suggestRelevantDPIs(context);
      
      res.json({
        id: uniqueId,
        sender: "assistant",
        suggestedDPIs: suggestions.suggestedDPIs,
        reasoning: suggestions.reasoning,
        timestamp: Date.now(),
      });
    } else {
      // Answer DPI questions
      const chatHistory = chatHistoryArray ? chatHistoryArray.map((m: any) => `${m.sender}: ${m.text}`).join('\n') : undefined;
      const response = await answerDPIQuestion(message, persona, chatHistory);
      
      res.json({
        id: uniqueId,
        sender: "assistant",
        answer: response.answer,
        sources: response.sources,
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    console.error('Error in chat function:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const feedback = async (req: any, res: any) => {
  try {
    const { messageId, feedback: feedbackType } = req.body;
    
    // Log feedback for analysis (in a real app, you'd store this in a database)
    console.log(`Feedback received for message ${messageId}: ${feedbackType}`);
    
    res.json({ success: true, message: 'Feedback received' });
  } catch (error) {
    console.error('Error in feedback function:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};