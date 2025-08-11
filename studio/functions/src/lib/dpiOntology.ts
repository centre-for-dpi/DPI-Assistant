/**
 * DPI Ontology - A comprehensive mapping of DPI terms, synonyms, and relationships
 * This allows automatic query expansion without manual intervention
 */

export interface DPITerm {
  primary: string;
  synonyms: string[];
  related: string[];
  category: string;
  boost?: number; // Optional boost factor for search
}

export class DPIOntology {
  private terms: Map<string, DPITerm>;
  
  constructor() {
    this.terms = new Map();
    this.initializeOntology();
  }
  
  private initializeOntology() {
    // Core DPI Terms
    this.addTerm({
      primary: 'DaaS',
      synonyms: ['dpi as a packaged solution', 'packaged solution', 'dpi as a service', 'digital public infrastructure as a service'],
      related: ['rapid deployment', 'funded program', 'cohort', '90 days', '180 days', 'pre-packaged', 'non-procurement', 'open source artefacts', 'pre-trained service provider', 'CDPI', 'EkStep'],
      category: 'implementation',
      boost: 1.5
    });
    
    this.addTerm({
      primary: 'funding',
      synonyms: ['finance', 'financial support', 'grants', 'investment'],
      related: ['DaaS', 'development partners', 'government budget', 'philanthropic', 'world bank', 'gates foundation'],
      category: 'finance',
      boost: 1.3
    });
    
    this.addTerm({
      primary: 'ID-Account Mapper',
      synonyms: ['account mapper', 'financial address mapper', 'ID mapper', 'SPAR', 'FAM'],
      related: ['social protection', 'G2P', 'beneficiary', 'payments', 'G2P mapper', 'mobile number', 'email id', 'authenticable id', 'financial address'],
      category: 'building_block',
      boost: 1.2
    });
    
    this.addTerm({
      primary: 'beneficiary registry',
      synonyms: ['social registry', 'beneficiary database', 'recipient registry'],
      related: ['G2P', 'social protection', 'eligibility', 'targeting'],
      category: 'building_block'
    });
    
    this.addTerm({
      primary: 'ID authentication',
      synonyms: ['identity authentication', 'ID auth', 'authentication service'],
      related: ['digital identity', 'G2P', 'verification', 'KYC'],
      category: 'building_block'
    });
    
    this.addTerm({
      primary: 'eKYC',
      synonyms: ['electronic KYC', 'e-KYC', 'digital KYC'],
      related: ['ID authentication', 'G2P', 'verification', 'onboarding'],
      category: 'building_block'
    });
    
    this.addTerm({
      primary: 'financial address',
      synonyms: ['fa', 'normative address', 'store of value address'],
      related: ['ID-Account Mapper', 'mobile number', 'email', 'bank account', 'wallet', 'id-type:id@provider'],
      category: 'concept',
      boost: 1.1
    });
    
    this.addTerm({
      primary: 'digital identity',
      synonyms: ['digital ID', 'foundational ID', 'functional ID', 'identity system'],
      related: ['authentication', 'KYC', 'verification', 'Aadhaar', 'MOSIP'],
      category: 'building_block'
    });
    
    this.addTerm({
      primary: 'digital payments',
      synonyms: ['payment infrastructure', 'payments system', 'digital payment system'],
      related: ['UPI', 'interoperability', 'financial inclusion', 'P2P', 'P2G', 'G2P', 'IQR', 'QR codes'],
      category: 'building_block'
    });
    
    this.addTerm({
      primary: 'data exchange',
      synonyms: ['data sharing', 'information exchange', 'data interoperability'],
      related: ['consent', 'privacy', 'API', 'standards', 'protocols'],
      category: 'building_block'
    });
    
    this.addTerm({
      primary: 'verifiable credentials',
      synonyms: ['digital credentials', 'VC', 'digital certificates'],
      related: ['Inji', 'wallet', 'attestation', 'verification', 'W3C'],
      category: 'building_block'
    });
    
    this.addTerm({
      primary: 'civil registry',
      synonyms: ['civil registration', 'CRVS', 'birth registration', 'death registration'],
      related: ['foundational data', 'identity', 'vital statistics'],
      category: 'registry'
    });
    
    this.addTerm({
      primary: 'G2P',
      synonyms: ['government to person', 'govt to person benefits', 'social benefits', 'cash transfers'],
      related: ['registries', 'cash in cash out', 'CICO', 'G2P mapper', 'ID authentication', 'eKYC', 'social protection', 'beneficiary'],
      category: 'use_case'
    });
    
    this.addTerm({
      primary: 'G2P mapper',
      synonyms: ['G2P account mapper', 'beneficiary mapper'],
      related: ['ID-Account Mapper', 'financial address', 'beneficiary registry', 'G2P'],
      category: 'building_block'
    });
    
    this.addTerm({
      primary: 'G2P Connect',
      synonyms: ['G2P community', 'G2P collaborative'],
      related: ['social protection', 'community effort', 'OpenG2P'],
      category: 'community',
      boost: 0.8 // Lower boost as it's not a DPI itself
    });
    
    this.addTerm({
      primary: 'Cash in Cash out',
      synonyms: ['CICO', 'cash-in cash-out', 'last mile delivery'],
      related: ['G2P', 'payment infrastructure', 'agent networks', 'financial inclusion'],
      category: 'building_block'
    });
    
    this.addTerm({
      primary: 'interoperability',
      synonyms: ['interoperable', 'cross-platform', 'system integration'],
      related: ['standards', 'API', 'protocols', 'data exchange', 'IQR'],
      category: 'principle'
    });
    
    this.addTerm({
      primary: 'IQR',
      synonyms: ['interoperable QR', 'interoperable QR codes', 'interoperable quick response', 'UPI QR', 'Bharat QR'],
      related: ['QR codes', 'merchant payments', 'payment acceptance', 'digital payments', 'UPI', 'P2M', 'EMVco', 'QR standard', 'interoperable payments protocol', 'unified authentication'],
      category: 'building_block',
      boost: 1.5
    });
    
    this.addTerm({
      primary: 'interoperable payments protocol',
      synonyms: ['unified payments protocol', 'cross-provider payment protocol', 'payment interoperability standard'],
      related: ['IQR', 'UPI', 'Pix', 'digital payments', 'payment infrastructure', 'real-time payments'],
      category: 'building_block',
      boost: 1.4
    });
    
    this.addTerm({
      primary: 'unified authentication',
      synonyms: ['common authentication', 'interoperable authentication', 'unified auth'],
      related: ['IQR', 'digital identity', 'payment authentication', 'eKYC', 'identity verification'],
      category: 'building_block',
      boost: 1.3
    });
    
    this.addTerm({
      primary: 'QR codes',
      synonyms: ['QR code', 'quick response code', 'payment QR', 'merchant QR'],
      related: ['IQR', 'merchant payments', 'payment acceptance', 'digital payments', 'scan and pay', 'P2M'],
      category: 'technology'
    });
    
    this.addTerm({
      primary: 'merchant payments',
      synonyms: ['merchant acceptance', 'P2M', 'person to merchant', 'merchant QR', 'payment acceptance'],
      related: ['IQR', 'QR codes', 'digital payments', 'UPI', 'interoperability', 'vendor lock-in'],
      category: 'use_case'
    });
    
    this.addTerm({
      primary: 'CDPI',
      synonyms: ['centre for digital public infrastructure', 'center for DPI'],
      related: ['advisory', 'technical assistance', 'DPI strategy', 'DaaS', 'funded program'],
      category: 'organization'
    });
    
    this.addTerm({
      primary: 'non-procurement',
      synonyms: ['direct deployment', 'rapid implementation'],
      related: ['DaaS', 'speed', 'upgrades', 'existing infrastructure'],
      category: 'approach'
    });
    
    this.addTerm({
      primary: 'DaaS cohort',
      synonyms: ['funded cohort', 'DaaS program', 'competitive application'],
      related: ['DaaS', 'CDPI', 'EkStep', 'funding', '180 days'],
      category: 'program'
    });
    
    // Add more terms as needed...
  }
  
  private addTerm(term: DPITerm) {
    // Index by primary term
    this.terms.set(term.primary.toLowerCase(), term);
    
    // Also index by synonyms for quick lookup
    term.synonyms.forEach(synonym => {
      this.terms.set(synonym.toLowerCase(), term);
    });
  }
  
  /**
   * Expand a query using the ontology
   */
  expandQuery(query: string): {
    original: string;
    expanded: string;
    terms: string[];
    boostFactors: Map<string, number>;
  } {
    const lowerQuery = query.toLowerCase();
    const foundTerms = new Set<string>();
    const relatedTerms = new Set<string>();
    const boostFactors = new Map<string, number>();
    
    // Find all matching terms in the query
    for (const [key, term] of this.terms) {
      if (lowerQuery.includes(key)) {
        foundTerms.add(term.primary);
        
        // Add synonyms
        term.synonyms.forEach(syn => relatedTerms.add(syn));
        
        // Add related terms
        term.related.forEach(rel => relatedTerms.add(rel));
        
        // Store boost factor
        if (term.boost) {
          boostFactors.set(term.primary, term.boost);
        }
      }
    }
    
    // Build expanded query
    const allTerms = [...foundTerms, ...relatedTerms];
    const expanded = query + ' ' + allTerms.join(' ');
    
    return {
      original: query,
      expanded: expanded.trim(),
      terms: allTerms,
      boostFactors
    };
  }
  
  /**
   * Get all terms in a category
   */
  getTermsByCategory(category: string): DPITerm[] {
    const results: DPITerm[] = [];
    const seen = new Set<string>();
    
    for (const term of this.terms.values()) {
      if (term.category === category && !seen.has(term.primary)) {
        results.push(term);
        seen.add(term.primary);
      }
    }
    
    return results;
  }
  
  /**
   * Suggest related terms for a given term
   */
  getRelatedTerms(term: string): string[] {
    const termData = this.terms.get(term.toLowerCase());
    if (!termData) return [];
    
    return [...termData.synonyms, ...termData.related];
  }
  
  /**
   * Check if a term exists in the ontology
   */
  hasTerm(term: string): boolean {
    return this.terms.has(term.toLowerCase());
  }
  
  /**
   * Get boost factor for a term
   */
  getBoostFactor(term: string): number {
    const termData = this.terms.get(term.toLowerCase());
    return termData?.boost || 1.0;
  }
}

// Export singleton instance
export const dpiOntology = new DPIOntology();