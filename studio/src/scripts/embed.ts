
import { config } from 'dotenv';
import { getVectorStore } from '../lib/vectorStore';

// Load environment variables from .env.local
config({ path: '.env.local' });

console.log("Re-initializing DPI Knowledge Base with semantic embeddings...");

async function main() {
    try {
        console.log("Starting embedding generation for DPI knowledge base...");
        
        // Force recreation of vector store
        const vectorStore = await getVectorStore();
        await vectorStore.createVectorStore();
        
        console.log("✅ Successfully generated embeddings for DPI knowledge base!");
        console.log("🚀 Semantic search is now enabled for improved response quality.");
        
    } catch (error) {
        console.error("❌ Error generating embeddings:", error);
        process.exit(1);
    }
}

main().then(() => {
    console.log("✨ Embedding generation complete!");
    process.exit(0);
}).catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
