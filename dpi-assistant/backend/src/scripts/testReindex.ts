/**
 * Script to test re-indexing functionality
 * Run with: tsc && node lib/scripts/testReindex.js
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { S3Service } from '../services/s3Service';
import { IndexingService } from '../services/indexingService';
import { VectorStore } from '../services/vectorStore';
import { EmbeddingService } from '../utils/embeddings';
import { extractTextFromPDF, isPDF } from '../utils/pdfExtractor';

// Load environment variables
const envPath = path.join(__dirname, '..', '..', '..', '.env');
dotenv.config({ path: envPath });

async function testReindex() {
  try {
    console.log('🧪 Testing Re-index Functionality\n');
    console.log('='.repeat(60));

    // Check environment variables
    const s3BucketName = process.env.S3_KNOWLEDGE_BASE_BUCKET;
    const awsRegion = process.env.AWS_REGION || 'ap-south-1';
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';

    if (!s3BucketName) {
      console.error('❌ S3_KNOWLEDGE_BASE_BUCKET not set');
      process.exit(1);
    }

    if (!apiKey) {
      console.error('❌ GOOGLE_AI_API_KEY not set');
      process.exit(1);
    }

    console.log(`✅ S3 Bucket: ${s3BucketName}`);
    console.log(`✅ AWS Region: ${awsRegion}`);
    console.log(`✅ Qdrant URL: ${qdrantUrl}\n`);

    // Initialize services
    console.log('📦 Initializing services...');
    const s3Service = new S3Service(s3BucketName, awsRegion);
    const vectorStore = new VectorStore(qdrantUrl);
    const embeddingService = new EmbeddingService(apiKey);

    // Check Qdrant connection
    console.log('🔍 Checking Qdrant connection...');
    const collectionInfo = await vectorStore.getCollectionInfo();
    if (collectionInfo) {
      console.log(`✅ Qdrant connected: ${collectionInfo.points_count} vectors`);
    } else {
      console.log('⚠️  Qdrant collection not initialized, creating...');
      await vectorStore.initializeCollection();
      console.log('✅ Qdrant collection created');
    }

    const indexingService = new IndexingService(vectorStore, embeddingService);

    // List files in S3
    console.log('\n📋 Listing files in S3...');
    const files = await s3Service.listFiles();
    console.log(`Found ${files.length} files:\n`);

    files.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });

    // Ask which file to test (for now, just test the first PDF)
    const targetFile = files.find(f => f.includes('Cambodia') || isPDF(f));

    if (!targetFile) {
      console.log('\n⚠️  No target file found. Testing first file instead.');
      if (files.length === 0) {
        console.log('❌ No files in S3 to test');
        process.exit(1);
      }
    }

    const fileToTest = targetFile || files[0];
    console.log(`\n🎯 Testing re-index on: "${fileToTest}"\n`);
    console.log('='.repeat(60));

    // Download file
    console.log('📥 Downloading file from S3...');
    const fileBuffer = await s3Service.downloadFile(fileToTest);
    console.log(`✅ Downloaded ${fileBuffer.length} bytes`);

    // Extract content
    console.log('\n📄 Extracting content...');
    let content: string;
    if (isPDF(fileToTest)) {
      console.log('   Detected PDF, extracting text...');
      content = await extractTextFromPDF(fileBuffer);
    } else {
      console.log('   Detected text file, reading content...');
      content = fileBuffer.toString('utf-8');
    }
    console.log(`✅ Extracted ${content.length} characters`);
    console.log(`   Preview: ${content.substring(0, 200)}...`);

    // Index the document
    console.log('\n🔄 Indexing document...');
    await indexingService.indexDocument(fileToTest, content);
    console.log(`✅ Successfully indexed "${fileToTest}"`);

    // Verify indexing
    console.log('\n✅ Verification...');
    const finalInfo = await vectorStore.getCollectionInfo();
    if (finalInfo) {
      console.log(`   Total vectors in store: ${finalInfo.points_count}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      console.error('   Error stack:', error.stack);
    }
    process.exit(1);
  }
}

// Run the test
testReindex();
