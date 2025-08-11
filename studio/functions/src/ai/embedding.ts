
// Simplified embedding model for Firebase Functions
// Using a basic text similarity approach instead of complex embeddings
export const embeddingModel = {
  embed: async (text: string) => {
    // Simple text processing for similarity matching
    return text.toLowerCase().split(' ').filter(word => word.length > 3);
  }
};
