import * as fs from 'fs';
import * as path from 'path';
import { S3Service } from '../services/s3Service';
import * as dotenv from 'dotenv';

// Load environment variables from parent directory (for local execution)
const envPath = path.join(__dirname, '..', '..', '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

async function migrateKnowledgeBaseToS3() {
  console.log('🚀 Starting migration of knowledge base to S3...\n');

  // Check required environment variables
  const bucketName = process.env.S3_KNOWLEDGE_BASE_BUCKET;
  const region = process.env.AWS_REGION || 'ap-south-1';

  if (!bucketName) {
    console.error('❌ Error: S3_KNOWLEDGE_BASE_BUCKET environment variable is not set');
    console.error('Please add it to your .env file');
    process.exit(1);
  }

  // Initialize S3 service
  const s3Service = new S3Service(bucketName, region);
  console.log(`📦 Target S3 bucket: ${bucketName}`);
  console.log(`🌍 Region: ${region}\n`);

  // Path to local knowledge base
  const kbPath = path.join(__dirname, '..', '..', 'content', 'knowledge-base');

  if (!fs.existsSync(kbPath)) {
    console.error(`❌ Error: Knowledge base directory not found at ${kbPath}`);
    process.exit(1);
  }

  // Read all markdown files
  const files = fs.readdirSync(kbPath);
  const markdownFiles = files.filter(file => file.endsWith('.md'));

  console.log(`📄 Found ${markdownFiles.length} markdown files to migrate:\n`);

  let successCount = 0;
  let errorCount = 0;

  // Upload each file to S3
  for (const file of markdownFiles) {
    try {
      const filePath = path.join(kbPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      console.log(`  Uploading: ${file} (${(content.length / 1024).toFixed(2)} KB)`);

      await s3Service.uploadDocument(file, content);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Failed to upload ${file}:`, error);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary:');
  console.log(`  ✅ Successfully uploaded: ${successCount} files`);
  console.log(`  ❌ Failed: ${errorCount} files`);
  console.log(`  📦 S3 Bucket: s3://${bucketName}/knowledge-base/`);
  console.log('='.repeat(60));

  if (successCount > 0) {
    console.log('\n✅ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify files in S3 console or using AWS CLI');
    console.log('2. Update your backend to use S3_KNOWLEDGE_BASE_BUCKET in .env');
    console.log('3. Restart your server to load knowledge base from S3');
  }
}

// Run migration
migrateKnowledgeBaseToS3().catch(error => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});
