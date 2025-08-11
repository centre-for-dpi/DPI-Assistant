/**
 * Query Analytics - Track and learn from user queries
 * Helps identify gaps in knowledge base and ontology
 */

import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export interface QueryLog {
  query: string;
  processedQuery: {
    intent: string;
    entities: string[];
    confidence: number;
  };
  contextLength: number;
  timestamp: Date;
  feedback?: {
    helpful: boolean;
    missing?: string;
  };
}

export class QueryAnalytics {
  private collection = 'queryLogs';
  
  /**
   * Log a query and its processing results
   */
  async logQuery(
    query: string, 
    processedQuery: any, 
    contextLength: number
  ): Promise<void> {
    try {
      const log: QueryLog = {
        query,
        processedQuery: {
          intent: processedQuery.intent,
          entities: processedQuery.entities,
          confidence: processedQuery.confidence
        },
        contextLength,
        timestamp: new Date()
      };
      
      await db.collection(this.collection).add(log);
      
      // Also check for potential gaps
      if (contextLength < 200 || processedQuery.confidence < 0.5) {
        await this.logPotentialGap(query, processedQuery);
      }
    } catch (error) {
      console.error('Error logging query:', error);
    }
  }
  
  /**
   * Log queries that might indicate knowledge gaps
   */
  private async logPotentialGap(query: string, processedQuery: any): Promise<void> {
    try {
      await db.collection('knowledgeGaps').add({
        query,
        reason: processedQuery.confidence < 0.5 ? 'low_confidence' : 'short_context',
        entities: processedQuery.entities,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging knowledge gap:', error);
    }
  }
  
  /**
   * Get frequent queries that returned poor results
   */
  async getProblematicQueries(limit: number = 20): Promise<any[]> {
    try {
      const snapshot = await db.collection(this.collection)
        .where('contextLength', '<', 500)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error getting problematic queries:', error);
      return [];
    }
  }
  
  /**
   * Get entities that are frequently queried but have low confidence
   */
  async getMissingEntities(): Promise<Map<string, number>> {
    try {
      const snapshot = await db.collection(this.collection)
        .where('processedQuery.confidence', '<', 0.6)
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get();
      
      const entityCounts = new Map<string, number>();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data() as QueryLog;
        data.processedQuery.entities.forEach(entity => {
          entityCounts.set(entity, (entityCounts.get(entity) || 0) + 1);
        });
      });
      
      return entityCounts;
    } catch (error) {
      console.error('Error getting missing entities:', error);
      return new Map();
    }
  }
  
  /**
   * Generate suggestions for ontology improvements
   */
  async generateOntologySuggestions(): Promise<string[]> {
    const suggestions: string[] = [];
    
    try {
      // Get frequently missed entities
      const missingEntities = await this.getMissingEntities();
      
      // Sort by frequency
      const sorted = Array.from(missingEntities.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      
      sorted.forEach(([entity, count]) => {
        if (count > 3) {
          suggestions.push(`Add "${entity}" to ontology (queried ${count} times with low confidence)`);
        }
      });
      
      // Get problematic queries
      const problematic = await this.getProblematicQueries(10);
      
      // Look for patterns
      const patterns = new Map<string, number>();
      problematic.forEach(log => {
        const words = log.query.toLowerCase().split(' ');
        words.forEach((word: string) => {
          if (word.length > 4) {
            patterns.set(word, (patterns.get(word) || 0) + 1);
          }
        });
      });
      
      // Suggest new terms based on patterns
      Array.from(patterns.entries())
        .filter(([word, count]) => count > 2)
        .forEach(([word, count]) => {
          suggestions.push(`Consider adding "${word}" as a term or synonym (appeared in ${count} problematic queries)`);
        });
      
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
    
    return suggestions;
  }
}

// Export singleton instance
export const queryAnalytics = new QueryAnalytics();