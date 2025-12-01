import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { extractTextFromPDF, isSupportedDocument } from '../utils/pdfExtractor';

export interface S3Document {
  key: string;
  content: string;
  lastModified?: Date;
  size?: number;
}

export class S3Service {
  private client: S3Client;
  private bucketName: string;
  private prefix: string;

  constructor(bucketName: string, region: string = 'ap-south-1', prefix: string = 'knowledge-base/') {
    this.client = new S3Client({ region });
    this.bucketName = bucketName;
    this.prefix = prefix;
  }

  /**
   * Upload a markdown document to S3
   */
  async uploadDocument(fileName: string, content: string): Promise<void> {
    const key = `${this.prefix}${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: content,
      ContentType: 'text/markdown',
      Metadata: {
        uploadedAt: new Date().toISOString(),
      },
    });

    await this.client.send(command);
    console.log(`✅ Uploaded ${fileName} to S3: s3://${this.bucketName}/${key}`);
  }

  /**
   * Upload a file buffer (for Slack uploads)
   */
  async uploadFileBuffer(fileName: string, buffer: Buffer): Promise<void> {
    const key = `${this.prefix}${fileName}`;

    // Determine content type based on file extension
    const contentType = fileName.toLowerCase().endsWith('.pdf')
      ? 'application/pdf'
      : 'text/markdown';

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        uploadedAt: new Date().toISOString(),
        source: 'slack',
      },
    });

    await this.client.send(command);
    console.log(`✅ Uploaded ${fileName} to S3 from Slack: s3://${this.bucketName}/${key}`);
  }

  /**
   * Download a single document from S3
   */
  async getDocument(fileName: string): Promise<string> {
    const key = `${this.prefix}${fileName}`;

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.client.send(command);

    if (!response.Body) {
      throw new Error(`Document ${fileName} has no content`);
    }

    // Convert stream to buffer
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    // Extract text based on file type
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return await extractTextFromPDF(buffer);
    } else {
      return buffer.toString('utf-8');
    }
  }

  /**
   * List all supported documents in the knowledge base (markdown and PDF)
   */
  async listDocuments(): Promise<S3Document[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: this.prefix,
    });

    const response = await this.client.send(command);

    if (!response.Contents) {
      return [];
    }

    return response.Contents
      .filter(obj => {
        const fileName = obj.Key?.replace(this.prefix, '') || '';
        return isSupportedDocument(fileName);
      })
      .map(obj => ({
        key: obj.Key!.replace(this.prefix, ''),
        content: '', // Content loaded on demand
        lastModified: obj.LastModified,
        size: obj.Size,
      }));
  }

  /**
   * Load all supported documents from S3 (markdown and PDF)
   */
  async loadAllDocuments(): Promise<string> {
    const documents = await this.listDocuments();
    console.log(`📚 Loading ${documents.length} documents from S3...`);

    let knowledgeBase = '';

    for (const doc of documents) {
      try {
        const content = await this.getDocument(doc.key);
        knowledgeBase += `\n\n--- ${doc.key} ---\n${content}`;
      } catch (error) {
        console.error(`❌ Error loading ${doc.key}:`, error);
      }
    }

    console.log(`✅ Loaded ${knowledgeBase.length} characters from S3`);
    return knowledgeBase;
  }

  /**
   * Check if a document exists in S3
   */
  async documentExists(fileName: string): Promise<boolean> {
    const key = `${this.prefix}${fileName}`;

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Delete a document from S3
   */
  async deleteDocument(fileName: string): Promise<void> {
    const key = `${this.prefix}${fileName}`;

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.client.send(command);
    console.log(`🗑️  Deleted ${fileName} from S3`);
  }

  /**
   * Get the S3 bucket name
   */
  getBucketName(): string {
    return this.bucketName;
  }

  /**
   * Get the prefix path
   */
  getPrefix(): string {
    return this.prefix;
  }
}
