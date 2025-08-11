import * as functions from 'firebase-functions';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// const ai = genkit({
//   plugins: [googleAI()],
//   model: 'googleai/gemini-1.5-flash',
// });

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
    const kbPath = path.join(__dirname, '..', 'src', 'content', 'knowledge-base');
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
    const promptPath = path.join(__dirname, '..', 'src', 'content', 'prompts', `${promptName}.md`);
    return fs.readFileSync(promptPath, 'utf-8');
  } catch (error) {
    console.error(`Error loading prompt ${promptName}:`, error);
    return '';
  }
}

// Fill prompt template with variables (for future AI integration)
// function fillPromptTemplate(template: string, variables: Record<string, string>): string {
//   let filledTemplate = template;
//   
//   for (const [key, value] of Object.entries(variables)) {
//     const placeholder = `{{{${key}}}}`;
//     filledTemplate = filledTemplate.replace(new RegExp(placeholder, 'g'), value);
//   }
//   
//   return filledTemplate;
// }

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
    let context = await simpleStore.search(query, 50); // Increased from 15 to 50 results
    
    // If we got good results, return them
    if (context.length > 1000 && !context.includes('No relevant information')) { // Increased threshold from 500 to 1000
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
    
    // Get main results - significantly increased from 10,000 to 50,000 chars
    context = await vectorStore.getRelevantContext(enhancedQuery, 50000);
    
    // If low confidence or few results, try alternative queries
    if (processedQuery.confidence < 0.7 || context.length < 2000) { // Increased threshold
      console.log('Low confidence or few results, trying alternative queries...');
      const alternatives = queryProcessor.generateAlternativeQueries(query);
      
      for (const altQuery of alternatives.slice(1)) { // Skip original
        const altContext = await vectorStore.getRelevantContext(altQuery, 20000); // Increased from 5000
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
    
    // If no relevant content found, use broader search with DPI-specific context
    if (relevantSections.length < 1000 || relevantSections.includes('No relevant information found')) {
      console.log('Insufficient context found, trying broader search...');
      
      // Try multiple search strategies to ensure comprehensive coverage
      const searchStrategies = [
        `DPI digital public infrastructure ${question}`,
        `building blocks interoperability ${question}`,
        `open standards protocols ${question}`
      ];
      
      for (const searchQuery of searchStrategies) {
        const fallbackSections = await getRelevantContextSemantic(searchQuery);
        if (fallbackSections.length > relevantSections.length) {
          console.log(`Using broader search results from strategy: ${searchQuery}`);
          relevantSections = fallbackSections;
        }
      }
    }
    
    // Initialize Gemini AI
    const apiKey = functions.config().googleai?.api_key;
    if (!apiKey) {
      throw new Error('Google AI API key not configured');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7
      }
    });
    
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
    
    console.log('Raw AI response (first 500 chars):', responseText.substring(0, 500));
    
    // Parse the JSON response
    let answer = responseText;
    let sources = ['DPI Knowledge Base'];
    
    try {
      // Clean the response text to handle markdown code blocks
      let cleanedResponse = responseText.trim();
      
      // Remove markdown code block markers if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.substring(7);
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.substring(3);
      }
      
      if (cleanedResponse.endsWith('```')) {
        cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length - 3);
      }
      
      // Remove any backticks at the start or end
      cleanedResponse = cleanedResponse.replace(/^`+|`+$/g, '').trim();
      
      // Try to extract JSON if it's embedded in the response
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }
      
      // Parse the cleaned response
      const jsonResponse = JSON.parse(cleanedResponse);
      if (jsonResponse.answer) {
        answer = jsonResponse.answer;
        // Check if the answer itself is a JSON string (double encoded)
        if (typeof answer === 'string' && answer.trim().startsWith('{') && answer.includes('"answer"')) {
          console.warn('Detected double-encoded JSON in answer, attempting to parse...');
          try {
            const innerJson = JSON.parse(answer);
            if (innerJson.answer) {
              answer = innerJson.answer;
            }
          } catch (e) {
            console.error('Failed to parse inner JSON:', e);
          }
        }
      }
      if (jsonResponse.sources && Array.isArray(jsonResponse.sources)) {
        sources = jsonResponse.sources.length > 0 ? jsonResponse.sources : ['DPI Knowledge Base'];
      }
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.log('Parse error details:', parseError);
      console.log('Raw response:', responseText.substring(0, 500));
      
      // If JSON parsing fails, try to extract meaningful content
      // Check if the response contains markdown content
      if (responseText.includes('**') || responseText.includes('##') || responseText.includes('*')) {
        // It might be markdown content, use it directly
        answer = responseText;
      } else {
        // Last resort - use the response as is
        answer = responseText;
      }
    }
    
    // Final cleanup - ensure we never return unwanted JSON wrapper
    // BUT preserve intentional JSON content within code blocks
    if (typeof answer === 'string' && answer.includes('"answer":') && !answer.includes('```')) {
      console.log('Detected JSON wrapper, extracting content...');
      // Try to extract answer from JSON wrapper
      const contentMatch = answer.match(/"answer"\s*:\s*"([\s\S]*?)"\s*[,}]/);
      if (contentMatch) {
        answer = contentMatch[1]
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\')
          .replace(/\\t/g, '\t');
      } else {
        // Try to extract everything between first { and last }
        const jsonObjMatch = answer.match(/\{[\s\S]*\}/);
        if (jsonObjMatch) {
          try {
            const parsed = JSON.parse(jsonObjMatch[0]);
            if (parsed.answer) {
              answer = parsed.answer;
            }
          } catch (e) {
            console.error('Final JSON extraction failed:', e);
          }
        }
      }
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
    
    // Absolutely final check - ensure answer is clean
    if (typeof answer === 'string') {
      // Only remove JSON artifacts if they're wrapper artifacts, not intentional content
      if (!answer.includes('```') && answer.includes('"answer"')) {
        // This looks like unwrapped JSON, try to clean it
        answer = answer
          .replace(/^[\s\S]*?"answer"\s*:\s*"/m, '') // Remove everything up to "answer": "
          .replace(/"[\s\S]*$/m, '') // Remove trailing quote and everything after
          .trim();
      }
      
      // Log if answer still looks like raw JSON (not in code blocks)
      if (!answer.includes('```') && (answer.startsWith('{') || answer.includes('"answer"'))) {
        console.warn('Note: Answer contains JSON-like content outside of code blocks');
        console.warn('Answer preview:', answer.substring(0, 200));
      }
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

export const chat = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { message, chatHistoryArray, persona, action, attachedFileName, attachedFileContent } = req.body;
    
    const uniqueId = randomUUID();
    
    // Handle Quick Actions
    if (action) {
      let actionResponse = '';
      
      switch (action) {
        case 'upload-strategy':
          // For strategy document analysis
          if (attachedFileContent) {
            // Analyze the actual document content - increase limit for better analysis
            const contentForAnalysis = attachedFileContent.substring(0, 50000); // Increased from 10k to 50k
            
            const analysisPrompt = `STOP! DO NOT give generic DPI advice. You MUST analyze THIS SPECIFIC document and quote from it.

Document: ${attachedFileName}

ACTUAL DOCUMENT CONTENT TO ANALYZE:
${contentForAnalysis}

MANDATORY REQUIREMENTS:
1. FIRST, extract and list at least 5 specific priorities, goals, or challenges mentioned in the document above (with exact quotes)
2. ONLY recommend DPI solutions that directly address the priorities mentioned in THIS document
3. For EVERY recommendation, you MUST include a direct quote from the document showing why it's relevant
4. If you cannot find relevant quotes in the document, DO NOT make that recommendation

ABOUT VERIFIABLE CREDENTIALS:
- Paper-based VCs can be a QUICK WIN (3-6 months) if you're just digitizing existing paper credentials
- Only categorize as long-term if building a fully digital, interoperable VC ecosystem
- For quick wins: Simple QR codes on paper certificates, basic verification portals

Provide your analysis in this structure:

**📋 Document Summary & Key Priorities Identified:**
- List the main strategic priorities I found in YOUR document (with quotes)
- Highlight the specific challenges and goals mentioned
- Note any existing initiatives or systems referenced

**🚀 DPI Quick Wins Based on Your Priorities (3-12 months):**
For each quick win, structure as:

**[Initiative Name] - Addresses your priority: "[quote specific priority from document]"**
- What: [Description linking to document's context]
- Timeline: [Specific months]
- Budget: [Range based on country context if mentioned]
- Why this makes sense for YOU: [Link to specific challenge/goal in document]
- How it builds on: [Reference existing systems/initiatives mentioned in document]
- Global reference: [Similar implementation]

**🎯 DPI Long-Term Projects Aligned with Your Strategy (12+ months):**
For each project:

**[Project Name] - Supports your goal: "[quote specific goal from document]"**
- What: [Detailed description connected to document's vision]
- Phases: [Breakdown aligned with document's timeline if mentioned]
- Budget estimate: [Comprehensive analysis]
- Strategic alignment: [How it delivers on specific objectives in the document]
- Prerequisites: [Link to quick wins or existing capabilities mentioned]
- Success metrics: [Related to KPIs in document if any]

**🔄 Transform Your Existing Initiatives into DPI Building Blocks:**
- For EACH existing system/initiative mentioned in the document, explain:
  - "Your [specific system mentioned] can become a reusable DPI component by..."
  - Technical steps to make it interoperable
  - How other departments can leverage it

**📊 Recommendations Based on Your Strategic Context:**
1. **Priority Sequencing**: Based on the dependencies in your document...
2. **Risk Mitigation**: Addressing the concerns you raised about...
3. **Quick Wins First**: Start with [specific initiative] because your document emphasizes...
4. **Partnerships**: Leverage the stakeholders you mentioned like...

Remember: EVERY recommendation must reference specific content from the uploaded document. If you can't link it to something in the document, don't include it.`;
            
            // Log document content to verify it's being passed
            console.log('Document analysis requested for:', attachedFileName);
            console.log('Document content length:', contentForAnalysis.length);
            console.log('First 500 chars of document:', contentForAnalysis.substring(0, 500));
            
            const analysisResponse = await answerDPIQuestion(analysisPrompt, persona, '');
            actionResponse = analysisResponse.answer;
          } else {
            // Fallback for when content isn't provided
            actionResponse = `I'll analyze the strategy document "${attachedFileName}" to identify DPI quick wins and long-term projects.\n\n`;
            actionResponse += `**Note:** To provide specific recommendations based on your document, please ensure the file is properly uploaded. Here's a general framework for identifying DPI opportunities:\n\n`;
            actionResponse += `**Quick Wins (3-12 months):**\n`;
            actionResponse += `1. **Digital ID Integration**: Integrate existing ID systems with government services\n`;
            actionResponse += `   - Timeline: 6-9 months\n`;
            actionResponse += `   - Impact: High - improves service delivery\n`;
            actionResponse += `   - Reference: India's Aadhaar, MOSIP\n\n`;
            actionResponse += `2. **Payment Gateway Standardization**: Create unified payment interface for government\n`;
            actionResponse += `   - Timeline: 4-6 months\n`;
            actionResponse += `   - Impact: Medium - reduces transaction costs\n`;
            actionResponse += `   - Reference: India's UPI, Brazil's Pix\n\n`;
            
            actionResponse += `**Long-term Projects (12+ months):**\n`;
            actionResponse += `1. **National Data Exchange Layer**: Build interoperability framework\n`;
            actionResponse += `   - Timeline: 18-24 months\n`;
            actionResponse += `   - Prerequisites: API standards, governance framework\n`;
            actionResponse += `   - Reference: Estonia's X-Road\n\n`;
            
            actionResponse += `**Key Recommendations:**\n`;
            actionResponse += `- Start with pilot implementations in selected regions\n`;
            actionResponse += `- Establish cross-ministry DPI task force\n`;
            actionResponse += `- Partner with private sector for innovation\n`;
          }
          break;
          
        case 'draft-email':
          // For email generation
          const emailParts = message.match(/Please draft an email to (.*) with subject "(.*)" summarizing/);
          const recipients = emailParts?.[1] || 'team';
          const subject = emailParts?.[2] || 'DPI Strategy Insights';
          
          actionResponse = `**Email Draft**\n\n`;
          actionResponse += `**To:** ${recipients}\n`;
          actionResponse += `**Subject:** ${subject}\n\n`;
          actionResponse += `Dear Team,\n\n`;
          actionResponse += `Following our recent discussion on Digital Public Infrastructure opportunities, I wanted to share key insights and actionable recommendations.\n\n`;
          actionResponse += `**Key Insights:**\n`;
          actionResponse += `• DPI can accelerate digital transformation by 3-5 years\n`;
          actionResponse += `• Interoperability is crucial for maximizing impact\n`;
          actionResponse += `• Public-private partnerships drive innovation\n\n`;
          actionResponse += `**Recommended Next Steps:**\n`;
          actionResponse += `1. Schedule stakeholder alignment workshop (Week 1)\n`;
          actionResponse += `2. Draft technical architecture blueprint (Week 2-3)\n`;
          actionResponse += `3. Identify pilot implementation partners (Week 4)\n\n`;
          actionResponse += `Looking forward to discussing these opportunities further.\n\n`;
          actionResponse += `Best regards,\n[Your Name]`;
          break;
          
        case 'create-strategy-note':
          // For strategy note generation
          const titleMatch = message.match(/create a concise strategy note titled "(.*)" based on/);
          const noteTitle = titleMatch?.[1] || 'DPI Implementation Strategy';
          
          actionResponse = `**Strategy Note: ${noteTitle}**\n\n`;
          actionResponse += `**Executive Summary**\n`;
          actionResponse += `This strategy note outlines a comprehensive approach to implementing Digital Public Infrastructure, focusing on quick wins and sustainable long-term development.\n\n`;
          actionResponse += `**1. Current State Assessment**\n`;
          actionResponse += `- Limited digital service integration\n`;
          actionResponse += `- Strong mobile penetration (opportunity)\n`;
          actionResponse += `- Growing demand for digital services\n\n`;
          actionResponse += `**2. Strategic Priorities**\n`;
          actionResponse += `- Digital Identity: Foundation for all services\n`;
          actionResponse += `- Payment Infrastructure: Enable digital economy\n`;
          actionResponse += `- Data Exchange: Break down silos\n\n`;
          actionResponse += `**3. Implementation Roadmap**\n`;
          actionResponse += `- Phase 1 (Months 1-6): Foundation & Quick Wins\n`;
          actionResponse += `- Phase 2 (Months 7-12): Scale & Integration\n`;
          actionResponse += `- Phase 3 (Year 2+): Innovation & Expansion\n\n`;
          actionResponse += `**4. Success Metrics**\n`;
          actionResponse += `- Service delivery time reduction: 70%\n`;
          actionResponse += `- Digital transaction volume: 10x increase\n`;
          actionResponse += `- Citizen satisfaction: 85%+ approval\n\n`;
          actionResponse += `[Download this strategy note as PDF]`;
          break;
      }
      
      if (actionResponse) {
        res.json({
          id: uniqueId,
          sender: "assistant",
          answer: actionResponse,
          sources: ['DPI Best Practices', 'Global Implementation Examples'],
          timestamp: Date.now(),
        });
        return;
      }
    }
    
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
});

export const feedback = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { messageId, feedback: feedbackType } = req.body;
    
    // Log feedback for analysis (in a real app, you'd store this in a database)
    console.log(`Feedback received for message ${messageId}: ${feedbackType}`);
    
    res.json({ success: true, message: 'Feedback received' });
  } catch (error) {
    console.error('Error in feedback function:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}); 