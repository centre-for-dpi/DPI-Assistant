
'use server';

/**
 * @fileOverview Answers questions related to Digital Public Infrastructure (DPI) using the provided knowledge base.
 *
 * - answerDPIQuestions - A function that answers DPI-related questions.
 * - AnswerDPIQuestionsInput - The input type for the answerDPIQuestions function.
 * - AnswerDPIQuestionsOutput - The return type for the answerDPIQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs';
import * as path from 'path';

const AnswerDPIQuestionsInputSchema = z.object({
  question: z.string().describe('The user’s current question about Digital Public Infrastructure.'),
  knowledgeBase: z
    .string()
    .describe('The knowledge base to use for answering the question.'),
  chatHistory: z.string().optional().describe('The preceding conversation history, if any. Use for context only if relevant to the current question.'),
  persona: z.string().optional().describe('The persona the AI should adopt for the response (e.g., Technical, Legal, Country Bureaucrat).'),
});
export type AnswerDPIQuestionsInput = z.infer<typeof AnswerDPIQuestionsInputSchema>;

const AnswerDPIQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about DPI.'),
  sources: z.array(z.string()).optional().describe('The sources used to answer the question, if any were cited in the knowledge base or content was extracted/transcribed for the answer.'),
});
export type AnswerDPIQuestionsOutput = z.infer<typeof AnswerDPIQuestionsOutputSchema>;

export async function answerDPIQuestions(input: AnswerDPIQuestionsInput): Promise<AnswerDPIQuestionsOutput> {
  return answerDPIQuestionsFlow(input);
}

// Load prompt from Markdown file
const promptTemplatePath = path.join(process.cwd(), 'src', 'content', 'prompts', 'answer-dpi-questions-prompt.md');
let promptTemplate = '';
try {
  promptTemplate = fs.readFileSync(promptTemplatePath, 'utf-8');
} catch (error) {
  console.error("Error reading answer-dpi-questions-prompt.md:", error);
  // Fallback prompt in case file reading fails
  promptTemplate = `Error: Could not load prompt template.
Knowledge Base: {{{knowledgeBase}}}
{{#if chatHistory}}Previous Conversation:
{{{chatHistory}}}{{/if}}
Question: {{{question}}}`;
}

const prompt = ai.definePrompt({
  name: 'answerDPIQuestionsPrompt',
  input: {schema: AnswerDPIQuestionsInputSchema},
  output: {schema: AnswerDPIQuestionsOutputSchema},
  prompt: promptTemplate,
  tools: [],
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ]
  }
});

const answerDPIQuestionsFlow = ai.defineFlow(
  {
    name: 'answerDPIQuestionsFlow',
    inputSchema: AnswerDPIQuestionsInputSchema,
    outputSchema: AnswerDPIQuestionsOutputSchema,
  },
  async input => {
    // Log the input for easier debugging, truncating knowledgeBase if it's too long for the log.
    console.log('[answerDPIQuestionsFlow] Received input:', JSON.stringify(
      {
        ...input,
        knowledgeBase: input.knowledgeBase.length > 1000 ? `${input.knowledgeBase.substring(0, 500)}... (truncated for logging) ...${input.knowledgeBase.substring(input.knowledgeBase.length - 500)}` : input.knowledgeBase,
      }, null, 2));

    // Warn if knowledge base seems excessively large.
    // Typical token limits are around 32k tokens for models like Gemini Pro,
    // and Gemini Flash has 1M token context window.
    // A character count is a rough proxy. 200k characters could be ~50k tokens.
    if (input.knowledgeBase.length > 200000) {
        console.warn(`[answerDPIQuestionsFlow] Warning: Knowledge base content is very large (${input.knowledgeBase.length} characters). This might exceed token limits or cause issues with the AI model response.`);
    }
    if (input.knowledgeBase.length === 0) {
        console.warn(`[answerDPIQuestionsFlow] Warning: Knowledge base content is empty.`);
    }


    const {output} = await prompt(input);
    if (!output) {
      console.error("[answerDPIQuestionsFlow] Prompt returned no output. The AI model did not return a valid structured response. Full Input (with potentially truncated KB) was logged above. This could be due to model errors, misconfiguration, safety filters, an inability to conform to the output schema, or excessively large input. Please check all server logs for more details.");
      throw new Error("The AI model did not return a valid structured response. This could be due to model errors, misconfiguration, safety filters, or an inability to conform to the output schema. Please check server logs for more details, including the input sent to the model.");
    }
    return output;
  }
);
