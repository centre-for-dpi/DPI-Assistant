/**
 * Text chunking utilities for knowledge base processing
 */

export interface Chunk {
  text: string;
  metadata: {
    source: string;
    chunkIndex: number;
    totalChunks: number;
  };
}

/**
 * Chunk text into smaller segments for embedding
 * Uses semantic chunking with overlap for better context preservation
 * MAX SIZE: 20,000 characters (~5,000 tokens) to stay within API limits
 */
export function chunkText(
  text: string,
  source: string,
  maxChunkChars: number = 2000,  // Conservative size in characters
  overlapChars: number = 200
): Chunk[] {
  const chunks: Chunk[] = [];

  // Split by paragraphs first for semantic preservation
  const paragraphs = text.split(/\n\n+/);

  let currentChunk = '';
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    // If paragraph itself is too large, split it by sentences
    if (trimmedParagraph.length > maxChunkChars) {
      const sentences = trimmedParagraph.split(/\.(?=\s|$)/);
      for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();
        if (!trimmedSentence) continue;

        // If adding sentence would exceed max, save current chunk
        if (currentChunk.length > 0 &&
            (currentChunk.length + trimmedSentence.length) > maxChunkChars) {
          chunks.push({
            text: currentChunk.trim(),
            metadata: {
              source,
              chunkIndex: chunkIndex++,
              totalChunks: 0
            }
          });

          // Keep overlap
          const overlap = currentChunk.slice(-overlapChars);
          currentChunk = overlap + ' ';
        }

        currentChunk += trimmedSentence + '. ';
      }
      continue;
    }

    // If adding this paragraph would exceed chunk size, save current chunk
    if (currentChunk.length > 0 &&
        (currentChunk.length + trimmedParagraph.length) > maxChunkChars) {
      chunks.push({
        text: currentChunk.trim(),
        metadata: {
          source,
          chunkIndex: chunkIndex++,
          totalChunks: 0
        }
      });

      // Keep overlap from previous chunk
      const overlap = currentChunk.slice(-overlapChars);
      currentChunk = overlap + ' ';
    }

    currentChunk += trimmedParagraph + '\n\n';
  }

  // Add the last chunk
  if (currentChunk.trim()) {
    chunks.push({
      text: currentChunk.trim(),
      metadata: {
        source,
        chunkIndex: chunkIndex++,
        totalChunks: 0
      }
    });
  }

  // Update totalChunks for all chunks
  const totalChunks = chunks.length;
  chunks.forEach(chunk => {
    chunk.metadata.totalChunks = totalChunks;
  });

  return chunks;
}

/**
 * Process all knowledge base files into chunks
 */
export function processKnowledgeBase(
  knowledgeBaseFiles: { filename: string; content: string }[]
): Chunk[] {
  const allChunks: Chunk[] = [];

  for (const file of knowledgeBaseFiles) {
    const fileChunks = chunkText(file.content, file.filename);
    allChunks.push(...fileChunks);
  }

  console.log(`📦 Processed ${knowledgeBaseFiles.length} files into ${allChunks.length} chunks`);

  return allChunks;
}
