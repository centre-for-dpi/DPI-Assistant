
export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text?: string; // For user messages
  answer?: string; // For DPI questions from assistant
  sources?: string[]; // For DPI questions
  suggestedDPIs?: Array<{ name: string; relevance: string }>; // For DPI suggestions
  reasoning?: string; // For DPI suggestions
  error?: string; // If an error occurred from assistant
  timestamp: number;
  feedback?: 'up' | 'down' | null; // Feedback state
}
