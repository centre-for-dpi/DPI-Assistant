
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant Digital Public Infrastructures (DPIs) based on a given country context.
 *
 * - suggestRelevantDPIs - A function that takes country context as input and returns suggestions for relevant DPIs.
 * - SuggestRelevantDPIsInput - The input type for the suggestRelevantDPIs function.
 * - SuggestRelevantDPIsOutput - The output type for the suggestRelevantDPIs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs';
import * as path from 'path';

// Input schema for the suggestRelevantDPIs flow
const SuggestRelevantDPIsInputSchema = z.object({
  countryContext: z
    .string()
    .describe(
      'Description of the country and its specific needs and challenges related to digital infrastructure.'
    ),
});
export type SuggestRelevantDPIsInput = z.infer<typeof SuggestRelevantDPIsInputSchema>;

// Output schema for the suggestRelevantDPIs flow
const SuggestRelevantDPIsOutputSchema = z.object({
  suggestedDPIs: z
    .array(
      z.object({
        name: z.string().describe("Name of the suggested DPI."),
        relevance: z.string().describe("Explanation of why this DPI is relevant to the provided country context."),
      })
    )
    .describe(
      'A list of suggested DPIs objects, each containing a name and its relevance.'
    ),
  reasoning: z
    .string()
    .describe(
      'Overall reasoning for the set of suggestions, based on the country context and available knowledge.'
    ),
});
export type SuggestRelevantDPIsOutput = z.infer<typeof SuggestRelevantDPIsOutputSchema>;

// Wrapper function to call the flow
export async function suggestRelevantDPIs(
  input: SuggestRelevantDPIsInput
): Promise<SuggestRelevantDPIsOutput> {
  return suggestRelevantDPIsFlow(input);
}

// Load prompt from Markdown file
const promptTemplatePath = path.join(process.cwd(), 'src', 'content', 'prompts', 'suggest-relevant-dpis-prompt.md');
let promptTemplate = '';
try {
  promptTemplate = fs.readFileSync(promptTemplatePath, 'utf-8');
} catch (error) {
  console.error("Error reading suggest-relevant-dpis-prompt.md:", error);
  promptTemplate = "Error: Could not load prompt template. Country Context: {{{countryContext}}}"; // Fallback prompt
}


// Define the prompt for suggesting relevant DPIs
const suggestRelevantDPIsPrompt = ai.definePrompt({
  name: 'suggestRelevantDPIsPrompt',
  input: {schema: SuggestRelevantDPIsInputSchema},
  output: {schema: SuggestRelevantDPIsOutputSchema},
  prompt: promptTemplate,
});

// Define the Genkit flow for suggesting relevant DPIs
const suggestRelevantDPIsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantDPIsFlow',
    inputSchema: SuggestRelevantDPIsInputSchema,
    outputSchema: SuggestRelevantDPIsOutputSchema,
  },
  async input => {
    const {output} = await suggestRelevantDPIsPrompt(input);
    return output!;
  }
);
