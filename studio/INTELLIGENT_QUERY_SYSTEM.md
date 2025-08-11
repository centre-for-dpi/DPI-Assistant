# Intelligent Query System for DPI Sage

## Overview
This document describes the sustainable, self-improving query system implemented for DPI Sage to ensure all DPI terms and concepts are properly recognized and retrieved without manual intervention.

## Key Components

### 1. DPI Ontology (`dpiOntology.ts`)
A comprehensive knowledge graph of DPI terms, synonyms, and relationships.

**Features:**
- Central repository of all DPI terms and their relationships
- Automatic synonym expansion
- Category-based organization
- Boost factors for important terms
- Easy to extend without code changes

**Example:**
```typescript
// DaaS is automatically expanded to include all its synonyms and related terms
'DaaS' → ['dpi as a packaged solution', 'rapid deployment', 'funded program', ...]
```

### 2. Query Processor (`queryProcessor.ts`)
Intelligent query understanding and enhancement.

**Features:**
- Intent detection (definition, implementation, funding, etc.)
- Entity extraction using ontology
- Dynamic query enhancement based on intent
- Confidence scoring
- Alternative query generation

**Example:**
```typescript
"What's DaaS?" → {
  intent: 'definition',
  entities: ['DaaS'],
  enhanced: 'What's DaaS? DaaS "DPI as a packaged solution" packaged digital infrastructure funded program rapid deployment definition explanation overview'
}
```

### 3. Query Analytics (`queryAnalytics.ts`)
Tracks and learns from user interactions.

**Features:**
- Logs all queries and their results
- Identifies knowledge gaps
- Tracks low-confidence queries
- Generates improvement suggestions
- Self-improvement reports

### 4. Admin Tools (`improveOntology.ts`)
Automated system improvement tools.

**Features:**
- Analyzes query patterns
- Suggests new ontology terms
- Generates improvement reports
- Can be scheduled to run periodically

## How It Works

1. **User asks a question** → "How do I get funding for DPI?"

2. **Query Processor**:
   - Detects intent: FUNDING
   - Extracts entities: ['funding', 'DPI']
   - Expands using ontology: adds 'DaaS', 'grants', 'development partners'
   - Creates enhanced query with all related terms

3. **Vector Search**:
   - Uses enhanced query for better recall
   - Adjusts thresholds based on query type
   - Tries alternative queries if needed

4. **Analytics**:
   - Logs query and results
   - If poor results, marks as potential gap
   - Accumulates data for improvements

5. **Self-Improvement**:
   - Admin tool analyzes patterns
   - Suggests new terms to add
   - System gets better over time

## Adding New Terms (No Code Changes!)

To add new DPI terms or concepts:

1. Edit `dpiOntology.ts`
2. Add new term in `initializeOntology()`:
```typescript
this.addTerm({
  primary: 'New Term',
  synonyms: ['alternate name', 'another name'],
  related: ['related concept', 'associated term'],
  category: 'category_name',
  boost: 1.2 // Optional: higher = more important
});
```

3. Deploy - no other changes needed!

## Monitoring & Improvement

### View Analytics
```typescript
// Get problematic queries
const issues = await queryAnalytics.getProblematicQueries();

// Get missing entities
const gaps = await queryAnalytics.getMissingEntities();
```

### Generate Improvement Report
```bash
npx tsx functions/src/admin/improveOntology.ts
```

This will:
- Analyze recent queries
- Identify patterns
- Suggest ontology additions
- Save report with code snippets

## Benefits

1. **No Manual Updates**: System automatically expands queries using ontology
2. **Self-Improving**: Learns from user queries to identify gaps
3. **Intent-Aware**: Different handling for definitions vs funding vs implementation
4. **Comprehensive**: Handles synonyms, related terms, and variations
5. **Measurable**: Analytics show what's working and what's not

## Future Enhancements

1. **Auto-update ontology** from analytics insights
2. **ML-based intent detection** for better accuracy
3. **User feedback integration** for continuous improvement
4. **Multi-language support** in ontology
5. **Domain-specific sub-ontologies** (health, education, etc.)

## Maintenance

- Review analytics weekly: `generateOntologyReport()`
- Update ontology based on suggestions
- Monitor query success rates
- Add new terms as DPI evolves

This system ensures that as DPI concepts evolve and new terms emerge, the chatbot will either handle them automatically through its intelligent processing or flag them for easy addition to the ontology.