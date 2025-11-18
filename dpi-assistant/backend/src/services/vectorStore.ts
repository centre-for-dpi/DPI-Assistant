/**
 * Vector store service using Qdrant
 */

import { QdrantClient } from '@qdrant/js-client-rest';
import { Chunk } from '../utils/chunking';

const COLLECTION_NAME = 'dpi_knowledge_base';
const VECTOR_SIZE = 768; // text-embedding-004 dimension

export interface SearchResult {
  text: string;
  score: number;
  metadata: {
    source: string;
    chunkIndex: number;
    totalChunks: number;
  };
}

export class VectorStore {
  private client: QdrantClient;

  constructor(url: string = 'http://localhost:6333') {
    this.client = new QdrantClient({ url });
  }

  /**
   * Initialize the collection if it doesn't exist
   */
  async initializeCollection(): Promise<void> {
    try {
      // Check if collection exists
      const collections = await this.client.getCollections();
      const collectionExists = collections.collections.some(
        c => c.name === COLLECTION_NAME
      );

      if (collectionExists) {
        console.log(`✅ Collection "${COLLECTION_NAME}" already exists`);
        return;
      }

      // Create collection
      await this.client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine'
        }
      });

      console.log(`✅ Created collection "${COLLECTION_NAME}"`);
    } catch (error) {
      console.error('Error initializing collection:', error);
      throw error;
    }
  }

  /**
   * Add chunks with their embeddings to the vector store
   */
  async addChunks(chunks: Chunk[], embeddings: number[][]): Promise<void> {
    if (chunks.length !== embeddings.length) {
      throw new Error('Chunks and embeddings length mismatch');
    }

    const points = chunks.map((chunk, index) => ({
      id: index,
      vector: embeddings[index],
      payload: {
        text: chunk.text,
        source: chunk.metadata.source,
        chunkIndex: chunk.metadata.chunkIndex,
        totalChunks: chunk.metadata.totalChunks
      }
    }));

    // Upload in batches of 100
    const batchSize = 100;
    for (let i = 0; i < points.length; i += batchSize) {
      const batch = points.slice(i, i + batchSize);
      await this.client.upsert(COLLECTION_NAME, {
        wait: true,
        points: batch
      });

      console.log(`📤 Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(points.length / batchSize)}`);
    }

    console.log(`✅ Added ${chunks.length} chunks to vector store`);
  }

  /**
   * Search for similar chunks
   */
  async search(
    queryEmbedding: number[],
    limit: number = 5,
    scoreThreshold: number = 0.7
  ): Promise<SearchResult[]> {
    try {
      const searchResult = await this.client.search(COLLECTION_NAME, {
        vector: queryEmbedding,
        limit,
        score_threshold: scoreThreshold,
        with_payload: true
      });

      return searchResult.map(result => ({
        text: result.payload?.text as string,
        score: result.score,
        metadata: {
          source: result.payload?.source as string,
          chunkIndex: result.payload?.chunkIndex as number,
          totalChunks: result.payload?.totalChunks as number
        }
      }));
    } catch (error) {
      console.error('Error searching vector store:', error);
      throw error;
    }
  }

  /**
   * Get collection info
   */
  async getCollectionInfo(): Promise<any> {
    try {
      return await this.client.getCollection(COLLECTION_NAME);
    } catch (error) {
      console.error('Error getting collection info:', error);
      return null;
    }
  }

  /**
   * Delete the collection (useful for reset)
   */
  async deleteCollection(): Promise<void> {
    try {
      await this.client.deleteCollection(COLLECTION_NAME);
      console.log(`🗑️  Deleted collection "${COLLECTION_NAME}"`);
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  }
}
