/**
 * Intelligent Query Processor
 * Uses multiple strategies to understand and enhance user queries
 */

import { dpiOntology } from './dpiOntology';

export interface ProcessedQuery {
  original: string;
  enhanced: string;
  intent: QueryIntent;
  entities: string[];
  confidence: number;
}

export enum QueryIntent {
  DEFINITION = 'definition',        // "What is X?"
  IMPLEMENTATION = 'implementation', // "How to implement X?"
  FUNDING = 'funding',              // "How to fund/finance X?"
  COMPARISON = 'comparison',        // "X vs Y"
  USE_CASE = 'use_case',           // "Examples of X"
  TECHNICAL = 'technical',         // Technical architecture questions
  GENERAL = 'general'              // General DPI questions
}

export class QueryProcessor {
  
  /**
   * Process a query using multiple enhancement strategies
   */
  processQuery(query: string): ProcessedQuery {
    const lowerQuery = query.toLowerCase();
    
    // Detect intent
    const intent = this.detectIntent(lowerQuery);
    
    // Extract entities using ontology
    const entities = this.extractEntities(query);
    
    // Enhance query based on intent and entities
    const enhanced = this.enhanceQuery(query, intent, entities);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(query, entities, intent);
    
    return {
      original: query,
      enhanced,
      intent,
      entities,
      confidence
    };
  }
  
  private detectIntent(query: string): QueryIntent {
    // Definition patterns
    if (query.match(/what\s+is|what's|what\s+are|define|definition|meaning/i)) {
      return QueryIntent.DEFINITION;
    }
    
    // Implementation patterns
    if (query.match(/how\s+to|implement|deploy|set\s+up|build|create|develop/i)) {
      return QueryIntent.IMPLEMENTATION;
    }
    
    // Funding patterns
    if (query.match(/fund|finance|pay\s+for|cost|budget|grant|investment/i)) {
      return QueryIntent.FUNDING;
    }
    
    // Comparison patterns
    if (query.match(/vs|versus|compare|difference|better|choose/i)) {
      return QueryIntent.COMPARISON;
    }
    
    // Use case patterns
    if (query.match(/example|use\s+case|case\s+study|success\s+story|implementation/i)) {
      return QueryIntent.USE_CASE;
    }
    
    // Technical patterns
    if (query.match(/architecture|technical|api|integration|specification|standard/i)) {
      return QueryIntent.TECHNICAL;
    }
    
    return QueryIntent.GENERAL;
  }
  
  private extractEntities(query: string): string[] {
    const entities: string[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Use ontology to find known terms
    const ontologyExpansion = dpiOntology.expandQuery(query);
    entities.push(...ontologyExpansion.terms);
    
    // Extract additional patterns
    // Extract "DPI for X" patterns
    const domainMatch = lowerQuery.match(/dpi\s+(?:for|in)\s+(\w+)/);
    if (domainMatch) {
      entities.push(domainMatch[1]);
    }
    
    // Extract country names (basic list, could be expanded)
    const countries = ['india', 'kenya', 'brazil', 'estonia', 'singapore', 'rwanda'];
    countries.forEach(country => {
      if (lowerQuery.includes(country)) {
        entities.push(country);
      }
    });
    
    return [...new Set(entities)]; // Remove duplicates
  }
  
  private enhanceQuery(query: string, intent: QueryIntent, entities: string[]): string {
    let enhanced = query;
    
    // Use ontology expansion first
    const ontologyExpansion = dpiOntology.expandQuery(query);
    enhanced = ontologyExpansion.expanded;
    
    // Add intent-specific enhancements
    switch (intent) {
      case QueryIntent.DEFINITION:
        enhanced += ' definition explanation overview introduction basics fundamentals';
        break;
        
      case QueryIntent.IMPLEMENTATION:
        enhanced += ' implementation guide steps process deployment rollout strategy technical';
        break;
        
      case QueryIntent.FUNDING:
        enhanced += ' funding finance grants DaaS investment budget cost development partners World Bank Gates Foundation government philanthropic';
        break;
        
      case QueryIntent.USE_CASE:
        enhanced += ' example case study success story implementation experience results outcomes';
        break;
        
      case QueryIntent.TECHNICAL:
        enhanced += ' architecture technical specification API integration standards protocols design';
        break;
    }
    
    // Add entity-specific enhancements
    if (entities.includes('DaaS')) {
      enhanced += ' "DPI as a packaged solution" rapid deployment 90 days funded program cohort';
    }
    
    if (entities.includes('social protection')) {
      enhanced += ' G2P beneficiary ID-Account Mapper cash transfers';
    }
    
    return enhanced.trim();
  }
  
  private calculateConfidence(query: string, entities: string[], intent: QueryIntent): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on entity recognition
    if (entities.length > 0) {
      confidence += 0.1 * Math.min(entities.length, 3); // Max 0.3 boost
    }
    
    // Increase confidence for clear intent
    if (intent !== QueryIntent.GENERAL) {
      confidence += 0.2;
    }
    
    // Check if query contains known DPI terms
    const knownTerms = ['dpi', 'digital public infrastructure', 'daas', 'cdpi'];
    if (knownTerms.some(term => query.toLowerCase().includes(term))) {
      confidence = Math.min(confidence + 0.1, 1.0);
    }
    
    return Math.min(confidence, 1.0);
  }
  
  /**
   * Generate alternative queries for better coverage
   */
  generateAlternativeQueries(query: string): string[] {
    const processed = this.processQuery(query);
    const alternatives: string[] = [query]; // Include original
    
    // Add variations based on intent
    switch (processed.intent) {
      case QueryIntent.DEFINITION:
        alternatives.push(
          `What is ${processed.entities.join(' and ')}?`,
          `Explain ${processed.entities.join(' ')} in DPI context`
        );
        break;
        
      case QueryIntent.FUNDING:
        alternatives.push(
          `DPI funding sources ${processed.entities.join(' ')}`,
          `How to finance ${processed.entities.join(' ')} implementation`
        );
        break;
        
      case QueryIntent.IMPLEMENTATION:
        alternatives.push(
          `Steps to implement ${processed.entities.join(' ')}`,
          `${processed.entities.join(' ')} deployment guide`
        );
        break;
    }
    
    return alternatives;
  }
}

// Export singleton instance
export const queryProcessor = new QueryProcessor();