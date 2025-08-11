/**
 * Simplified Vector Store - Direct semantic search without unnecessary complexity
 */

import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from 'langchain/document';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import * as fs from 'fs';
import * as path from 'path';

export class SimpleVectorStore {
  private vectorStore: MemoryVectorStore | null = null;
  private embeddings: GoogleGenerativeAIEmbeddings;
  private readonly knowledgeBasePath: string;

  constructor() {
    // Initialize embeddings
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: 'text-embedding-004',
      apiKey: process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY
    });

    this.knowledgeBasePath = path.join(
      process.cwd(),
      'src',
      'content',
      'knowledge-base'
    );
  }

  /**
   * Initialize or get existing vector store
   */
  async initialize(): Promise<void> {
    if (this.vectorStore) return;

    console.log('Initializing simple vector store...');
    const documents = await this.loadDocuments();
    
    // Create vector store from documents
    this.vectorStore = await MemoryVectorStore.fromDocuments(
      documents,
      this.embeddings
    );
    
    console.log('Simple vector store initialized');
  }

  /**
   * Load and chunk documents
   */
  private async loadDocuments(): Promise<Document[]> {
    const files = fs.readdirSync(this.knowledgeBasePath)
      .filter(file => file.endsWith('.md'));

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,  // Larger chunks for better context
      chunkOverlap: 200,
      separators: ['\n\n', '\n', '. ', ' ', '']
    });

    const allDocuments: Document[] = [];

    for (const file of files) {
      const filePath = path.join(this.knowledgeBasePath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const chunks = await splitter.createDocuments(
        [content],
        [{ source: file }]
      );

      allDocuments.push(...chunks);
      console.log(`Loaded ${file}: ${chunks.length} chunks`);
    }

    return allDocuments;
  }

  /**
   * Simple, direct semantic search
   */
  async search(query: string, maxResults: number = 10): Promise<string> {
    if (!this.vectorStore) {
      await this.initialize();
    }

    try {
      console.log(`Direct search for: "${query}"`);
      
      // Just do a simple similarity search - no fancy enhancements
      const results = await this.vectorStore!.similaritySearch(query, maxResults);
      
      if (results.length === 0) {
        return 'No relevant information found in the knowledge base.';
      }

      // Concatenate results with source information
      let context = '';
      const seenSources = new Set<string>();
      
      for (const doc of results) {
        const source = doc.metadata.source;
        
        // Add source header if not seen
        if (!seenSources.has(source)) {
          context += `\n\n**${source.replace('.md', '')}**\n`;
          seenSources.add(source);
        }
        
        // Add content
        context += doc.pageContent + '\n';
      }

      return context.trim();
    } catch (error) {
      console.error('Search error:', error);
      return 'Error performing search.';
    }
  }
}

// Export singleton
let simpleVectorStore: SimpleVectorStore | null = null;

export async function getSimpleVectorStore(): Promise<SimpleVectorStore> {
  if (!simpleVectorStore) {
    simpleVectorStore = new SimpleVectorStore();
    await simpleVectorStore.initialize();
  }
  return simpleVectorStore;
}