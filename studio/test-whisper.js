import fs from 'fs';
import { OpenAI } from 'openai';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testWhisper() {
  try {
    console.log('🎤 Testing OpenAI Whisper transcription...');
    
    if (!openai.apiKey) {
      console.error('❌ OpenAI API key not found');
      return;
    }
    
    console.log('✅ API key found:', openai.apiKey.substring(0, 10) + '...');
    
    if (!fs.existsSync('test-audio.mp3')) {
      console.error('❌ test-audio.mp3 file not found');
      return;
    }
    
    console.log('✅ Audio file found');
    
    const stats = fs.statSync('test-audio.mp3');
    console.log(`📊 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    
    console.log('🚀 Starting transcription...');
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream('test-audio.mp3'),
      model: 'whisper-1',
      language: 'en',
      prompt: 'This is a video about Digital Public Infrastructure (DPI), technology, government services, and digital transformation.',
    });

    console.log('✅ Transcription successful!');
    console.log('📝 Length:', transcription.text.length, 'characters');
    console.log('📄 First 200 chars:', transcription.text.substring(0, 200) + '...');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testWhisper();