
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { ModelReference } from 'genkit/ai';

async function checkModels() {
  try {
    await genkit.start({
      plugins: [googleAI()],
    });

    console.log(`Attempting to fetch available models using your current API key...
`);
    
    const models = await genkit.listModels();
    
    if (models.length === 0) {
      console.warn('No models were returned. This might indicate an issue with your API key permissions or project setup, even if no explicit error occurred.');
    } else {
      console.log(`Found ${models.length} total models available to your API key:
`);
    }
        
    models.forEach((model: ModelReference<any>, index: number) => {
      console.log(`${index + 1}. ${model.name}`);
      if (model.info?.description) {
        console.log(`   Description: ${model.info.description}`);
      }
      console.log('');
    });
    
    const googleModels = models.filter((model: ModelReference<any>) => model.name.startsWith('googleAI/'));
    console.log(`
Specifically, Google AI models found (${googleModels.length}):`);
    googleModels.forEach((model: ModelReference<any>) => {
      console.log(`- ${model.name}`);
    });

    if (!googleModels.some((model: ModelReference<any>) => model.name.includes('gemini'))) {
      console.warn(`
Warning: No Gemini models were found. Please ensure your API key and Google Cloud project have access to Gemini models.`);
    }
    
  } catch (error: any) {
    console.error('ERROR FETCHING MODELS:', error.message);
    console.error(`
This usually means there is an issue with your API key or Google Cloud project setup.`);
    console.error('Please double-check the following:');
    console.error('1. `.env` FILE: Ensure it exists in your project root and contains a valid `GOOGLE_API_KEY` (or `GOOGLE_GENAI_API_KEY`).');
    console.error('   Example: GOOGLE_API_KEY=AIzaSy..........');
    console.error('2. GOOGLE CLOUD CONSOLE:');
    console.error('   a. The "Generative Language API" must be ENABLED for the project associated with your API key.');
    console.error('   b. Billing must be ENABLED for that project.');
    console.error('   c. The API key must have the necessary permissions.');
    console.error('3. PACKAGES: Ensure `genkit` and `@genkit-ai/googleai` are installed (`npm install genkit @genkit-ai/googleai`).');
    console.error(`
If you recently made changes, restart your Genkit server.`);
  } finally {
    await genkit.stop();
  }
}

checkModels();
