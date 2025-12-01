/**
 * Script to populate the vector store with knowledge base content
 * Run with: npm run populate-vectors
 */

import * as fs from 'fs';
import * as path from 'path';
import { processKnowledgeBase } from '../utils/chunking';
import { EmbeddingService } from '../utils/embeddings';
import { VectorStore } from '../services/vectorStore';
import { extractTextFromPDF, isSupportedDocument, isPDF } from '../utils/pdfExtractor';

async function populateVectorStore() {
  console.log('🚀 Starting vector store population...\n');

  // Get API key
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.error('❌ GOOGLE_AI_API_KEY environment variable not set');
    process.exit(1);
  }

  // Get Qdrant URL (default to localhost)
  const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';

  try {
    // Load knowledge base files
    console.log('📚 Loading knowledge base files...');
    const kbPath = path.join(__dirname, '..', '..', 'content', 'knowledge-base');

    if (!fs.existsSync(kbPath)) {
      console.error('❌ Knowledge base directory not found');
      process.exit(1);
    }

    const fileNames = fs.readdirSync(kbPath).filter(file => isSupportedDocument(file));
    const files = [];

    for (const file of fileNames) {
      const filePath = path.join(kbPath, file);
      let content: string;

      if (isPDF(file)) {
        const buffer = fs.readFileSync(filePath);
        content = await extractTextFromPDF(buffer);
      } else {
        content = fs.readFileSync(filePath, 'utf-8');
      }

      files.push({ filename: file, content });
    }

    console.log(`✅ Loaded ${files.length} files\n`);

    // Chunk the content
    console.log('✂️  Chunking content...');
    const chunks = processKnowledgeBase(files);
    console.log(`✅ Created ${chunks.length} chunks\n`);

    // Generate embeddings
    console.log('🧮 Generating embeddings...');
    const embeddingService = new EmbeddingService(apiKey);
    const texts = chunks.map(chunk => chunk.text);

    const embeddings = await embeddingService.generateEmbeddings(
      texts,
      (current, total) => {
        process.stdout.write(`\r   Progress: ${current}/${total} (${Math.round(current / total * 100)}%)`);
      }
    );
    console.log('\n✅ Generated embeddings\n');

    // Initialize vector store
    console.log('🗄️  Initializing vector store...');
    const vectorStore = new VectorStore(qdrantUrl);
    await vectorStore.initializeCollection();

    // Add chunks to vector store
    console.log('\n📤 Uploading to vector store...');
    await vectorStore.addChunks(chunks, embeddings);

    // Get collection info
    const collectionInfo = await vectorStore.getCollectionInfo();
    console.log('\n📊 Collection Info:');
    console.log(`   Vectors: ${collectionInfo.points_count}`);
    console.log(`   Vector size: ${collectionInfo.config.params.vectors.size}`);
    console.log(`   Distance: ${collectionInfo.config.params.vectors.distance}`);

    console.log('\n✅ Vector store population complete!');
  } catch (error) {
    console.error('\n❌ Error populating vector store:', error);
    process.exit(1);
  }
}

// Run the script
populateVectorStore();
