
import { Document } from 'langchain/document';
import fs from 'fs/promises';
import path from 'path';

// This is a temporary in-memory simulation of a knowledge base.
// In a real application, you would use a vector database for this.
let knowledgeBase: string[] = [];

async function loadKnowledgeBase() {
  if (knowledgeBase.length > 0) return;

  try {
    const kbDir = path.join(process.cwd(), 'src', 'content', 'knowledge-base');
    const files = await fs.readdir(kbDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    for (const file of mdFiles) {
      const filePath = path.join(kbDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      // Simple splitting, not ideal for production but works for a temporary solution.
      knowledgeBase.push(...content.split('\n\n').filter(p => p.trim().length > 10));
    }
    console.log(`Knowledge base loaded with ${knowledgeBase.length} paragraphs.`);
  } catch (error) {
    console.error("Failed to load knowledge base from files:", error);
    knowledgeBase = ["Error loading knowledge base."];
  }
}

export async function createEmbeddings(documents: Document[]) {
  console.warn("createEmbeddings is a no-op in this temporary implementation.");
  // This function is now a no-op as we are not using a vector database.
}

export async function searchEmbeddings(query: string, limit: number = 5): Promise<string> {
  await loadKnowledgeBase();
  
  if (knowledgeBase.length === 0 || (knowledgeBase.length === 1 && knowledgeBase[0].startsWith("Error"))) {
    return "Knowledge base is not available.";
  }

  // This is a very basic keyword search, not a real semantic search.
  // It's a temporary replacement for the vector database functionality.
  const lowerCaseQuery = query.toLowerCase();
  const results = knowledgeBase
    .map(text => ({
      text,
      score: text.toLowerCase().includes(lowerCaseQuery) ? 1 : 0
    }))
    .filter(item => item.score > 0)
    .slice(0, limit)
    .map(item => item.text);

  if (results.length === 0) {
    return "No relevant information found in the knowledge base.";
  }

  return results.join('\n\n---\n\n');
}
