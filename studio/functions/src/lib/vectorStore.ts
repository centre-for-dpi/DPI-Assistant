import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

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
    // Initialize embeddings
    const apiKey = functions.config().googleai?.api_key;
    if (!apiKey) {
      throw new Error('Google AI API key not configured');
    }

    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: apiKey,
      model: 'text-embedding-004', // Using the same model as configured
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
   * Initialize vector store by loading documents from Firestore cache or creating new embeddings
   */
  async initialize(): Promise<void> {
    try {
      // Try to load from cache first
      const cachedStore = await this.loadFromCache();
      if (cachedStore) {
        this.vectorStore = cachedStore;
        console.log('Vector store loaded from cache');
        return;
      }

      // If no cache, create new embeddings
      console.log('No cache found, creating new vector store...');
      await this.createVectorStore();
    } catch (error) {
      console.error('Error initializing vector store:', error);
      throw error;
    }
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

    // Cache the vector store
    await this.saveToCache(documents);
    
    console.log('Vector store created and cached successfully');
  }

  /**
   * Load and chunk documents from the knowledge base
   */
  private async loadAndChunkDocuments(): Promise<Document[]> {
    const fs = require('fs');
    const path = require('path');
    
    const kbPath = path.join(__dirname, '..', 'content', 'knowledge-base');
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
    const lowerQuery = query.toLowerCase();
    
    // Add DaaS-specific variants
    if (lowerQuery.includes('daas') || lowerQuery.includes('packaged solution')) {
      queryVariants.push('DaaS DPI packaged solution rapid deployment funded program');
      queryVariants.push('Digital Public Infrastructure as a Service');
    }
    
    // Add funding-specific variants  
    if (lowerQuery.includes('funding') || lowerQuery.includes('fund') || lowerQuery.includes('finance')) {
      queryVariants.push('funding finance DaaS grants development partners investment');
      queryVariants.push('financial support government budget philanthropic funding');
    }
    
    // Only add specific terms if the query is clearly about building blocks or components
    if (lowerQuery.includes('building block') || 
        lowerQuery.includes('component') || 
        lowerQuery.includes('infrastructure')) {
      queryVariants.push(query + ' DPI components infrastructure');
    }
    
    // Only add mapper-specific terms if social protection is explicitly mentioned
    if (lowerQuery.includes('social protection') && 
        lowerQuery.includes('building block')) {
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
      
      // Adjust thresholds based on query type
      const lowerQuery = query.toLowerCase();
      let scoreThreshold = 0.3;
      let k = 8;
      
      // Be more lenient for important DPI terms and acronyms
      if (lowerQuery.includes('daas') || lowerQuery.includes('funding') || 
          lowerQuery.includes('packaged solution') || lowerQuery.includes('finance')) {
        scoreThreshold = 0.2; // Lower threshold for better recall
        k = 10; // Get more results
        console.log(`Using lenient search for key terms: threshold=${scoreThreshold}, k=${k}`);
      }
      
      // Use enhanced search with dynamic settings
      let results = await this.enhancedSearch(query, {
        k: k,
        scoreThreshold: scoreThreshold,
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
      const isDaaSQuery = queryLower.includes('daas') || queryLower.includes('packaged solution');
      const isFundingQuery = queryLower.includes('funding') || queryLower.includes('fund') || queryLower.includes('finance');
      
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
        
        // Boost DaaS-related content
        if (isDaaSQuery) {
          if (contentLower.includes('daas') || contentLower.includes('dpi as a packaged solution')) {
            keywordScore += 0.3; // Strong boost for DaaS content
          }
          if (contentLower.includes('packaged') || contentLower.includes('rapid deployment') || 
              contentLower.includes('funded program') || contentLower.includes('cohort')) {
            keywordScore += 0.2;
          }
        }
        
        // Boost funding-related content
        if (isFundingQuery) {
          if (contentLower.includes('funding') || contentLower.includes('finance') || 
              contentLower.includes('investment') || contentLower.includes('grants')) {
            keywordScore += 0.25; // Strong boost for funding content
          }
          if (contentLower.includes('daas') || contentLower.includes('development partners') || 
              contentLower.includes('government budget') || contentLower.includes('philanthropic')) {
            keywordScore += 0.2;
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

  /**
   * Save vector store to Firestore cache
   */
  private async saveToCache(documents: Document[]): Promise<void> {
    try {
      const cacheData = {
        documents: documents.map(doc => ({
          content: doc.pageContent,
          metadata: doc.metadata
        })),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        version: '1.0'
      };

      await db.collection('vectorCache').doc('dpi-knowledge-base').set(cacheData);
      console.log('Vector store cached to Firestore');
    } catch (error) {
      console.error('Error caching vector store:', error);
      // Don't throw - caching is not critical
    }
  }

  /**
   * Load vector store from Firestore cache
   */
  private async loadFromCache(): Promise<MemoryVectorStore | null> {
    try {
      const cacheDoc = await db.collection('vectorCache').doc('dpi-knowledge-base').get();
      
      if (!cacheDoc.exists) {
        return null;
      }

      const cacheData = cacheDoc.data();
      if (!cacheData || !cacheData.documents) {
        return null;
      }

      // Check if cache is recent (within 24 hours)
      const createdAt = cacheData.createdAt?.toDate();
      const now = new Date();
      const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceCreation > 24) {
        console.log('Cache is stale, will rebuild vector store');
        return null;
      }

      // Reconstruct documents
      const documents = cacheData.documents.map((doc: any) => 
        new Document({
          pageContent: doc.content,
          metadata: doc.metadata
        })
      );

      // Recreate vector store
      const vectorStore = await MemoryVectorStore.fromDocuments(
        documents,
        this.embeddings
      );

      return vectorStore;
    } catch (error) {
      console.error('Error loading from cache:', error);
      return null;
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