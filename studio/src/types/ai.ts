/**
 * Shared AI types for DPI Coach
 * Used across both frontend and backend implementations
 */

export interface DPIQuestion {
  question: string;
  knowledgeBase: string;
  chatHistory?: string;
  persona?: string;
}

export interface DPIAnswer {
  answer: string;
  sources?: string[];
}

export interface DPISuggestion {
  countryContext: string;
  sector?: string;
  problemStatement?: string;
  knowledgeBase: string;
}

export interface DPISuggestionOutput {
  suggestions: Array<{ name: string; relevance: string }>;
  reasoning?: string;
}

export interface ChatResponse {
  id: string;
  sender: "assistant";
  answer?: string;
  sources?: string[];
  suggestedDPIs?: Array<{ name: string; relevance: string }>;
  reasoning?: string;
  error?: string;
  timestamp: number;
}