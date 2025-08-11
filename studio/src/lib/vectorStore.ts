import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    chunkIndex: number;
    totalChunks: number;
    priority: boolean;
  };
  embedding?: number[];
}

export class DPIVectorStore {
  private vectorStore: MemoryVectorStore | null = null;
  private embeddings: GoogleGenerativeAIEmbeddings;
  private textSplitter: RecursiveCharacterTextSplitter;

  constructor() {
    // Get API key from environment
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('Google AI API key not configured. Please set GOOGLE_AI_API_KEY environment variable.');
    }

    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: apiKey,
      model: 'text-embedding-004',
    });

    // Configure text splitter for optimal chunking - smaller chunks to preserve context
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800, // Reduced from 1000 to keep concepts together
      chunkOverlap: 300, // Increased overlap to preserve context across chunks
      separators: ['\n\n', '\n', '. ', '! ', '? ', ' ', ''],
      // Keep important DPI terms together
      keepSeparator: true,
    });
  }

  /**
   * Initialize vector store
   */
  async initialize(): Promise<void> {
    if (this.vectorStore) {
      return; // Already initialized
    }

    console.log('Initializing DPI vector store...');
    await this.createVectorStore();
  }

  /**
   * Process documents and create vector store
   */
  async createVectorStore(): Promise<void> {
    const documents = await this.loadAndChunkDocuments();
    
    if (documents.length === 0) {
      throw new Error('No documents found to create vector store');
    }

    console.log(`Creating embeddings for ${documents.length} document chunks...`);
    
    // Create vector store with embeddings
    this.vectorStore = await MemoryVectorStore.fromDocuments(
      documents,
      this.embeddings
    );
    
    console.log('Vector store created successfully');
  }

  /**
   * Load and chunk documents from the knowledge base
   */
  private async loadAndChunkDocuments(): Promise<Document[]> {
    const fs = require('fs');
    const path = require('path');
    
    const kbPath = path.join(process.cwd(), 'src', 'content', 'knowledge-base');
    const files = fs.readdirSync(kbPath);
    
    const priorityFiles = [
      'Centre for Digital Public Infrastructure.md',
      'DPI for Healthcare.md', 
      'G2P Connect.md',
      'Strategy note compilation.md'
    ];

    const allDocuments: Document[] = [];

    // Process all markdown files
    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(kbPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const isPriority = priorityFiles.includes(file);

      // Split document into chunks
      const chunks = await this.textSplitter.splitText(content);
      
      // Create Document objects with metadata
      chunks.forEach((chunk, index) => {
        allDocuments.push(new Document({
          pageContent: chunk,
          metadata: {
            source: file,
            chunkIndex: index,
            totalChunks: chunks.length,
            priority: isPriority,
          }
        }));
      });

      console.log(`Processed ${file}: ${chunks.length} chunks (priority: ${isPriority})`);
    }

    console.log(`Total document chunks: ${allDocuments.length}`);
    return allDocuments;
  }

  /**
   * Perform semantic search to find relevant documents
   */
  async semanticSearch(query: string, options: {
    k?: number;
    scoreThreshold?: number;
    priorityBoost?: number;
  } = {}): Promise<Array<{ content: string; metadata: any; score: number }>> {
    if (!this.vectorStore) {
      await this.initialize();
    }

    const { k = 5, scoreThreshold = 0.3, priorityBoost = 0.2 } = options;

    try {
      // Perform similarity search with scores
      const results = await this.vectorStore!.similaritySearchWithScore(query, k * 2); // Get more results for filtering
      
      // Process results with priority boosting and filtering
      const processedResults = results
        .map(([doc, score]) => ({
          content: doc.pageContent,
          metadata: doc.metadata,
          score: doc.metadata.priority ? score + priorityBoost : score
        }))
        .filter(result => result.score >= scoreThreshold)
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, k); // Take top k results

      console.log(`Semantic search for "${query}": found ${processedResults.length} relevant chunks`);
      return processedResults;
    } catch (error) {
      console.error('Error performing semantic search:', error);
      throw error;
    }
  }

  /**
   * Balanced search with selective terminology enhancement
   */
  async enhancedSearch(query: string, options: {
    k?: number;
    scoreThreshold?: number;
    priorityBoost?: number;
  } = {}): Promise<Array<{ content: string; metadata: any; score: number }>> {
    const { k = 8, scoreThreshold = 0.25, priorityBoost = 0.3 } = options;
    
    // More conservative query enhancement
    const queryVariants = [query];
    
    // Only add specific terms if the query is clearly about building blocks or components
    if (query.toLowerCase().includes('building block') || 
        query.toLowerCase().includes('component') || 
        query.toLowerCase().includes('infrastructure')) {
      queryVariants.push(query + ' DPI components infrastructure');
    }
    
    // Only add mapper-specific terms if social protection is explicitly mentioned
    if (query.toLowerCase().includes('social protection') && 
        query.toLowerCase().includes('building block')) {
      queryVariants.push('ID account mapper financial address registry G2P payments');
    }

    let allResults: Array<{ content: string; metadata: any; score: number }> = [];

    // Search with query variants
    for (const queryVariant of queryVariants) {
      try {
        const results = await this.semanticSearch(queryVariant, {
          k: queryVariants.length === 1 ? k : Math.ceil(k / queryVariants.length), // Distribute results more evenly
          scoreThreshold: scoreThreshold,
          priorityBoost
        });
        allResults.push(...results);
      } catch (error) {
        console.warn(`Failed to search with variant: ${queryVariant}`, error);
      }
    }

    // Remove duplicates based on content similarity
    const uniqueResults = [];
    const seenContent = new Set();
    
    for (const result of allResults) {
      const contentKey = result.content.substring(0, 100);
      if (!seenContent.has(contentKey)) {
        seenContent.add(contentKey);
        uniqueResults.push(result);
      }
    }

    // Sort by score and take top k
    return uniqueResults
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }

  /**
   * Get contextual information with balanced content retrieval
   */
  async getRelevantContext(query: string, maxLength: number = 8000): Promise<string> {
    try {
      console.log(`Semantic search for: "${query}"`);
      
      // Use enhanced search with more conservative settings
      let results = await this.enhancedSearch(query, {
        k: 8,
        scoreThreshold: 0.3, // Higher threshold for better quality
        priorityBoost: 0.2   // Lower priority boost to avoid over-weighting
      });

      // Only use keyword backup if we have very few results
      if (results.length < 2) {
        console.log('Low result count, trying keyword backup...');
        const keywordResults = await this.keywordBackupSearch(query);
        
        // Only add a few of the best keyword results
        const topKeywordResults = keywordResults
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        
        results.push(...topKeywordResults);
        
        // Remove duplicates and re-sort
        const uniqueResults = [];
        const seenContent = new Set();
        for (const result of results) {
          const contentKey = result.content.substring(0, 100);
          if (!seenContent.has(contentKey)) {
            seenContent.add(contentKey);
            uniqueResults.push(result);
          }
        }
        results = uniqueResults.sort((a, b) => b.score - a.score).slice(0, 6);
      }

      if (results.length === 0) {
        return 'No relevant information found in the knowledge base for this query.';
      }

      console.log(`Found ${results.length} relevant chunks`);

      // Combine results with diversity in mind
      let context = '';
      let currentLength = 0;
      const addedSources = new Set<string>();
      const addedContent = new Set<string>();

      for (const result of results) {
        const source = result.metadata.source;
        const content = result.content.trim();
        
        // Skip if we already have very similar content
        const contentHash = content.substring(0, 150);
        if (addedContent.has(contentHash)) {
          continue;
        }
        addedContent.add(contentHash);
        
        // Add source header if not already added
        if (!addedSources.has(source)) {
          const header = `\n\n**${source.replace('.md', '')}** ${result.metadata.priority ? '(Priority Document)' : ''}\n`;
          if (currentLength + header.length + content.length < maxLength) {
            context += header;
            currentLength += header.length;
            addedSources.add(source);
          } else {
            break;
          }
        }

        // Add content if it fits
        if (currentLength + content.length < maxLength) {
          context += content + '\n';
          currentLength += content.length;
        } else {
          // Add partial content if possible
          const remainingSpace = maxLength - currentLength - 100;
          if (remainingSpace > 200) {
            context += content.substring(0, remainingSpace) + '...\n';
          }
          break;
        }
      }

      return context.trim();
    } catch (error) {
      console.error('Error getting relevant context:', error);
      return 'Error retrieving relevant information from the knowledge base.';
    }
  }

  /**
   * Balanced keyword backup search
   */
  async keywordBackupSearch(query: string): Promise<Array<{ content: string; metadata: any; score: number }>> {
    if (!this.vectorStore) {
      return [];
    }

    try {
      // Get documents with similarity search
      const allResults = await this.vectorStore.similaritySearchWithScore(query, 30);
      
      const queryLower = query.toLowerCase();
      const isSocialProtectionBuildingBlocks = queryLower.includes('social protection') && 
                                                queryLower.includes('building block');
      
      const keywordResults = [];
      
      for (const [doc, score] of allResults) {
        const contentLower = doc.pageContent.toLowerCase();
        let keywordScore = 0;
        
        // General query keywords
        const queryWords = queryLower.split(' ').filter(word => word.length > 3);
        for (const word of queryWords) {
          if (contentLower.includes(word)) {
            keywordScore += 0.1;
          }
        }
        
        // Only add specific mapper boost if the query is explicitly about social protection building blocks
        if (isSocialProtectionBuildingBlocks) {
          if (contentLower.includes('id-account mapper') || 
              contentLower.includes('account mapper') || 
              contentLower.includes('financial address mapper')) {
            keywordScore += 0.15; // Modest boost for mapper content
          }
          
          // Small boost for other social protection terms
          const spTerms = ['beneficiary', 'g2p', 'government-to-person', 'benefits'];
          for (const term of spTerms) {
            if (contentLower.includes(term)) {
              keywordScore += 0.05;
            }
          }
        }
        
        // Only include if there's meaningful relevance
        if (keywordScore > 0.15) {
          keywordResults.push({
            content: doc.pageContent,
            metadata: doc.metadata,
            score: Math.min(score + keywordScore * 0.5, 1.0) // Reduced weight for keyword scoring
          });
        }
      }
      
      console.log(`Keyword backup search found ${keywordResults.length} additional results`);
      return keywordResults;
      
    } catch (error) {
      console.error('Error in keyword backup search:', error);
      return [];
    }
  }
}

// Singleton instance
let vectorStoreInstance: DPIVectorStore | null = null;

export async function getVectorStore(): Promise<DPIVectorStore> {
  if (!vectorStoreInstance) {
    vectorStoreInstance = new DPIVectorStore();
    await vectorStoreInstance.initialize();
  }
  return vectorStoreInstance;
}