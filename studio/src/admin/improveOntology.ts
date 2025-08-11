/**
 * Admin function to review analytics and suggest ontology improvements
 * Run this periodically to keep the system improving
 */

import { queryAnalytics } from '../lib/queryAnalytics';
import { dpiOntology } from '../lib/dpiOntology';
import * as fs from 'fs';
import * as path from 'path';

export async function generateOntologyReport(): Promise<void> {
  console.log('Generating Ontology Improvement Report...\n');
  
  try {
    // Get suggestions from analytics
    const suggestions = await queryAnalytics.generateOntologySuggestions();
    
    console.log('=== Ontology Improvement Suggestions ===\n');
    
    if (suggestions.length === 0) {
      console.log('No suggestions at this time. System is performing well!');
      return;
    }
    
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion}`);
    });
    
    // Get problematic queries
    const problematicQueries = await queryAnalytics.getProblematicQueries(10);
    
    console.log('\n=== Recent Problematic Queries ===\n');
    problematicQueries.forEach((log, index) => {
      console.log(`${index + 1}. Query: "${log.query}"`);
      console.log(`   Context Length: ${log.contextLength} chars`);
      console.log(`   Confidence: ${log.processedQuery.confidence}`);
      console.log(`   Entities: ${log.processedQuery.entities.join(', ') || 'none'}\n`);
    });
    
    // Generate ontology update suggestions
    const ontologyUpdates = generateOntologyUpdates(suggestions, problematicQueries);
    
    if (ontologyUpdates.length > 0) {
      console.log('\n=== Suggested Ontology Updates ===\n');
      console.log('Add these to dpiOntology.ts:\n');
      
      ontologyUpdates.forEach(update => {
        console.log(update);
      });
      
      // Optionally save to file
      const reportPath = path.join(process.cwd(), 'ontology-improvement-report.txt');
      const reportContent = [
        'DPI Ontology Improvement Report',
        `Generated: ${new Date().toISOString()}`,
        '',
        '=== Suggestions ===',
        ...suggestions,
        '',
        '=== Ontology Updates ===',
        ...ontologyUpdates
      ].join('\n');
      
      fs.writeFileSync(reportPath, reportContent);
      console.log(`\nReport saved to: ${reportPath}`);
    }
    
  } catch (error) {
    console.error('Error generating report:', error);
  }
}

function generateOntologyUpdates(suggestions: string[], problematicQueries: any[]): string[] {
  const updates: string[] = [];
  
  // Extract potential new terms from suggestions
  const newTerms = new Set<string>();
  
  suggestions.forEach(suggestion => {
    const match = suggestion.match(/"([^"]+)"/);
    if (match) {
      newTerms.add(match[1]);
    }
  });
  
  // Analyze problematic queries for patterns
  problematicQueries.forEach(log => {
    const words = log.query.toLowerCase().split(' ')
      .filter(word => word.length > 4 && !dpiOntology.hasTerm(word));
    
    words.forEach(word => {
      if (!newTerms.has(word)) {
        // Check if it appears in multiple queries
        const count = problematicQueries.filter(q => 
          q.query.toLowerCase().includes(word)
        ).length;
        
        if (count > 2) {
          newTerms.add(word);
        }
      }
    });
  });
  
  // Generate code snippets for new terms
  newTerms.forEach(term => {
    updates.push(`
    this.addTerm({
      primary: '${term}',
      synonyms: [], // TODO: Add synonyms
      related: [], // TODO: Add related terms
      category: 'unknown', // TODO: Categorize
      boost: 1.0
    });`);
  });
  
  return updates;
}

// Function to run this as a scheduled job
export async function scheduleOntologyImprovement(): Promise<void> {
  // This could be scheduled to run weekly
  console.log('Running scheduled ontology improvement check...');
  await generateOntologyReport();
}