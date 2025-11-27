import { VectorStore } from './vectorStore';
import { EmbeddingService } from '../utils/embeddings';
import { chunkText } from '../utils/chunking';

export class IndexingService {
  private vectorStore: VectorStore;
  private embeddingService: EmbeddingService;

  constructor(vectorStore: VectorStore, embeddingService: EmbeddingService) {
    this.vectorStore = vectorStore;
    this.embeddingService = embeddingService;
  }

  /**
   * Index a single document into the vector store
   */
  async indexDocument(fileName: string, content: string): Promise<void> {
    console.log(`📝 Indexing document: ${fileName}`);

    try {
      // Chunk the document
      const chunks = chunkText(content, fileName);
      console.log(`  📄 Created ${chunks.length} chunks`);

      // Generate embeddings for each chunk
      const embeddings: number[][] = [];
      for (let i = 0; i < chunks.length; i++) {
        const embedding = await this.embeddingService.generateEmbedding(chunks[i].text);
        embeddings.push(embedding);

        if ((i + 1) % 10 === 0) {
          console.log(`  🔄 Generated embeddings: ${i + 1}/${chunks.length}`);
        }
      }

      // Upload chunks with embeddings to vector store
      await this.vectorStore.addChunks(chunks, embeddings);

      console.log(`✅ Successfully indexed ${fileName} (${chunks.length} chunks)`);
    } catch (error) {
      console.error(`❌ Error indexing ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * Re-index all documents from an array of documents
   */
  async reindexAllDocuments(documents: Array<{ fileName: string; content: string }>): Promise<void> {
    console.log(`🔄 Re-indexing ${documents.length} documents...`);

    let successCount = 0;
    let errorCount = 0;

    for (const doc of documents) {
      try {
        await this.indexDocument(doc.fileName, doc.content);
        successCount++;
      } catch (error) {
        console.error(`Failed to index ${doc.fileName}:`, error);
        errorCount++;
      }
    }

    console.log(`\n✅ Re-indexing complete: ${successCount} success, ${errorCount} errors`);
  }

  /**
   * Check if the vector store is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const collectionInfo = await this.vectorStore.getCollectionInfo();
      return collectionInfo !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get current vector store stats
   */
  async getStats(): Promise<{ pointsCount: number; vectorsCount: number } | null> {
    try {
      const collectionInfo = await this.vectorStore.getCollectionInfo();
      if (!collectionInfo) return null;

      return {
        pointsCount: collectionInfo.points_count || 0,
        vectorsCount: collectionInfo.vectors_count || 0,
      };
    } catch {
      return null;
    }
  }
}
