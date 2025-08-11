import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { config } from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Load environment variables
config({ path: '.env.local' });

const KB_PATH = path.join(process.cwd(), 'src', 'content', 'knowledge-base', 'main-kb.md');
const TEMP_AUDIO_DIR = path.join(process.cwd(), 'temp-audio');
const YOUTUBE_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:[^&\s]*&)*v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced download strategies
const DOWNLOAD_STRATEGIES = [
  {
    name: 'Standard',
    args: ['--extract-audio', '--audio-format', 'mp3', '--audio-quality', '5']
  },
  {
    name: 'Mobile User Agent',
    args: [
      '--extract-audio', '--audio-format', 'mp3', '--audio-quality', '5',
      '--user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7 like Mac OS X) AppleWebKit/605.1.15'
    ]
  },
  {
    name: 'Different Extractor',
    args: [
      '--extract-audio', '--audio-format', 'mp3', '--audio-quality', '5',
      '--extractor-args', 'youtube:player_client=android'
    ]
  },
  {
    name: 'Bypass Age Gate',
    args: [
      '--extract-audio', '--audio-format', 'mp3', '--audio-quality', '5',
      '--extractor-args', 'youtube:player_client=web',
      '--age-limit', '99'
    ]
  },
  {
    name: 'Alternative Format',
    args: [
      '--extract-audio', '--audio-format', 'wav', '--audio-quality', '0',
      '--postprocessor-args', '-ac 1 -ar 16000'
    ]
  }
];

function getVideoId(url: string): string | null {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[1] && match[1].length === 11) ? match[1] : null;
}

async function downloadAudioEnhanced(videoId: string): Promise<string | null> {
  if (!fs.existsSync(TEMP_AUDIO_DIR)) {
    fs.mkdirSync(TEMP_AUDIO_DIR, { recursive: true });
  }

  const outputPath = path.join(TEMP_AUDIO_DIR, `${videoId}.mp3`);
  
  if (fs.existsSync(outputPath)) {
    console.log(`Audio already exists for ${videoId}`);
    return outputPath;
  }

  console.log(`Downloading audio for video ${videoId} using enhanced strategies...`);

  // Try each strategy
  for (let i = 0; i < DOWNLOAD_STRATEGIES.length; i++) {
    const strategy = DOWNLOAD_STRATEGIES[i];
    console.log(`  Trying strategy ${i + 1}/${DOWNLOAD_STRATEGIES.length}: ${strategy.name}`);
    
    try {
      const ytDlpPath = '/Users/anusreejayakrishnan/Library/Python/3.9/bin/yt-dlp';
      const baseArgs = [
        `"https://www.youtube.com/watch?v=${videoId}"`,
        '--no-playlist',
        '--max-downloads', '1',
        '--retry', '2',
        '--extractor-retries', '2',
        '-o', `"${outputPath.replace('.mp3', '.%(ext)s')}"`
      ];

      const command = [ytDlpPath, ...baseArgs, ...strategy.args].join(' ');
      
      await execAsync(command, { 
        timeout: 120000, // 2 minute timeout per attempt
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });

      if (fs.existsSync(outputPath)) {
        console.log(`  ✅ Successfully downloaded with strategy: ${strategy.name}`);
        return outputPath;
      }
    } catch (error: any) {
      console.log(`  ❌ Strategy "${strategy.name}" failed:`, error.message?.slice(0, 100) + '...');
      
      // Wait between attempts to avoid rate limiting
      if (i < DOWNLOAD_STRATEGIES.length - 1) {
        console.log(`  ⏱️ Waiting 5 seconds before next strategy...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  console.log(`❌ All strategies failed for video ${videoId}`);
  return null;
}

async function compressAudio(inputPath: string): Promise<string> {
  const compressedPath = inputPath.replace('.mp3', '_compressed.mp3');
  
  try {
    await execAsync(`ffmpeg -i "${inputPath}" -ab 64k -ar 22050 -ac 1 "${compressedPath}" -y`);
    
    // Check if compression was successful and file is smaller
    const originalStats = fs.statSync(inputPath);
    const compressedStats = fs.statSync(compressedPath);
    
    if (compressedStats.size < originalStats.size && compressedStats.size < 25 * 1024 * 1024) {
      fs.unlinkSync(inputPath); // Remove original
      return compressedPath;
    } else {
      fs.unlinkSync(compressedPath); // Remove compressed version
      return inputPath;
    }
  } catch (error) {
    console.warn(`Compression failed, using original file`);
    return inputPath;
  }
}

async function transcribeAudio(audioPath: string, videoId: string): Promise<string | null> {
  try {
    // Check file size (OpenAI has a 25MB limit)
    const stats = fs.statSync(audioPath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    
    console.log(`Audio file size: ${fileSizeInMB.toFixed(2)}MB`);
    
    if (fileSizeInMB > 25) {
      console.log(`File too large, attempting compression...`);
      audioPath = await compressAudio(audioPath);
      
      const newStats = fs.statSync(audioPath);
      const newFileSizeInMB = newStats.size / (1024 * 1024);
      
      if (newFileSizeInMB > 25) {
        console.warn(`File still too large after compression: ${newFileSizeInMB.toFixed(2)}MB. Skipping.`);
        return null;
      }
    }

    console.log(`🎤 Transcribing ${videoId} using Whisper...`);
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
      prompt: 'This is a video about Digital Public Infrastructure (DPI), technology policy, government systems, financial inclusion, and digital transformation.',
      language: 'en',
      response_format: 'text',
      temperature: 0.1
    });
    
    console.log(`✅ Transcription successful: ${transcription.length} characters`);
    return transcription;
  } catch (error: any) {
    console.error(`❌ Transcription failed for ${videoId}:`, error.message);
    return null;
  }
}

function updateKnowledgeBase(videoUrl: string, transcript: string): void {
  let content = fs.readFileSync(KB_PATH, 'utf-8');
  
  // Find the video section and update it
  const videoUrlPattern = videoUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sectionRegex = new RegExp(`(${videoUrlPattern}[^\\n]*(?:\\n(?!   \\d+\\.).*)*?)(?=\\n   \\d+\\.|$)`, 's');
  
  if (content.match(sectionRegex)) {
    // Check if transcript already exists
    if (content.includes('**Video Transcript:**')) {
      const transcriptRegex = new RegExp(`(${videoUrlPattern}[^\\n]*(?:\\n(?!\\*\\*Video Transcript:\\*\\*)[^\\n]*)*)(\\n\\*\\*Video Transcript:\\*\\*[^\\n]*(?:\\n>[^\\n]*)*)?`, 's');
      content = content.replace(transcriptRegex, `$1\n\n**Video Transcript:**\n> ${transcript.replace(/\\n/g, '\n> ')}`);
    } else {
      content = content.replace(sectionRegex, `$1\n\n**Video Transcript:**\n> ${transcript.replace(/\\n/g, '\n> ')}`);
    }
    
    fs.writeFileSync(KB_PATH, content);
    console.log(`✅ Knowledge base updated for video`);
  } else {
    console.warn(`⚠️ Could not find video section in knowledge base`);
  }
}

async function main() {
  console.log('🎥 Starting Enhanced Whisper-based YouTube video transcription...');
  
  // Read knowledge base
  const knowledgeBase = fs.readFileSync(KB_PATH, 'utf-8');
  const urls = [...knowledgeBase.matchAll(YOUTUBE_URL_REGEX)];
  
  console.log(`📊 Found ${urls.length} YouTube videos to process`);
  
  let successful = 0;
  let failed = 0;
  let skipped = 0;
  
  for (let i = 0; i < urls.length; i++) {
    const match = urls[i];
    const fullUrl = match[0];
    const videoId = getVideoId(fullUrl);
    
    if (!videoId) continue;
    
    console.log(`\n🎬 Processing video ${i + 1}/${urls.length}: ${fullUrl}`);
    
    // Check if transcript already exists
    const videoSection = knowledgeBase.split(fullUrl)[1]?.split('\n   ')[0] || '';
    if (videoSection.includes('**Video Transcript:**')) {
      console.log(`✅ Transcript already exists - Skipping.`);
      skipped++;
      continue;
    }
    
    try {
      // Download audio with enhanced strategies
      const audioPath = await downloadAudioEnhanced(videoId);
      if (!audioPath) {
        failed++;
        continue;
      }
      
      // Transcribe audio
      const transcript = await transcribeAudio(audioPath, videoId);
      if (!transcript) {
        failed++;
        continue;
      }
      
      // Update knowledge base
      updateKnowledgeBase(fullUrl, transcript);
      
      // Clean up audio file
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
      
      successful++;
      
      // Rate limiting - wait between videos
      if (i < urls.length - 1) {
        console.log(`⏱️ Waiting 10 seconds before next video...`);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
      
    } catch (error: any) {
      console.error(`❌ Error processing video ${videoId}:`, error.message);
      failed++;
    }
  }
  
  // Cleanup temp directory
  if (fs.existsSync(TEMP_AUDIO_DIR)) {
    try {
      fs.rmSync(TEMP_AUDIO_DIR, { recursive: true, force: true });
      console.log('🧹 Cleaned up temporary audio directory');
    } catch (error) {
      console.warn('⚠️ Could not clean up temporary directory');
    }
  }
  
  console.log(`\n📊 Enhanced Transcription Summary:`);
  console.log(`├── Total videos processed: ${urls.length}`);
  console.log(`├── Successful transcriptions: ${successful}`);
  console.log(`├── Failed transcriptions: ${failed}`);
  console.log(`├── Skipped (already transcribed): ${skipped}`);
  console.log(`└── Success rate: ${((successful / urls.length) * 100).toFixed(1)}%`);
  
  if (successful > 0) {
    console.log(`\n🎉 Enhanced strategies successfully transcribed ${successful} additional videos!`);
    console.log(`💡 Remember to regenerate embeddings to include the new content in semantic search.`);
  }
}

main().catch(console.error);