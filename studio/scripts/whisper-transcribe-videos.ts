import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import YTDlpWrap from 'yt-dlp-wrap';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const KB_PATH = path.join(process.cwd(), 'src', 'content', 'knowledge-base', 'main-kb.md');
const TEMP_AUDIO_DIR = path.join(process.cwd(), 'temp-audio');
const YOUTUBE_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:[^&\s]*&)*v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

function getVideoId(url: string): string | null {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[1] && match[1].length === 11) ? match[1] : null;
}

async function downloadAudio(videoId: string): Promise<string | null> {
  try {
    // Ensure temp directory exists
    if (!fs.existsSync(TEMP_AUDIO_DIR)) {
      fs.mkdirSync(TEMP_AUDIO_DIR, { recursive: true });
    }

    const outputPath = path.join(TEMP_AUDIO_DIR, `${videoId}.mp3`);
    
    // Check if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`Audio file already exists for ${videoId}, using cached version`);
      return outputPath;
    }

    console.log(`Downloading audio for video ${videoId}...`);
    
    // Try to find yt-dlp binary
    const ytDlpPath = '/Users/anusreejayakrishnan/Library/Python/3.9/bin/yt-dlp';
    const ytDlpWrap = fs.existsSync(ytDlpPath) ? 
      new YTDlpWrap(ytDlpPath) : 
      new YTDlpWrap();
    
    // Download audio in MP3 format with improved settings (no keychain access)
    await ytDlpWrap.execPromise([
      `https://www.youtube.com/watch?v=${videoId}`,
      '--extract-audio',
      '--audio-format', 'mp3',
      '--audio-quality', '5', // Lower quality to reduce file size
      '--max-downloads', '1',
      '--retry', '3',
      '--sleep-interval', '1',
      '--extractor-retries', '3',
      '--add-header', 'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      '-o', outputPath.replace('.mp3', '.%(ext)s'),
      '--no-playlist'
    ]);

    if (fs.existsSync(outputPath)) {
      console.log(`Successfully downloaded audio for ${videoId}`);
      return outputPath;
    } else {
      console.error(`Failed to download audio for ${videoId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error downloading audio for ${videoId}:`, error);
    return null;
  }
}

async function transcribeAudio(audioPath: string): Promise<string | null> {
  try {
    console.log(`Transcribing audio file: ${audioPath}`);
    
    // Check file size (OpenAI has a 25MB limit)
    const stats = fs.statSync(audioPath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    
    if (fileSizeInMB > 25) {
      console.warn(`Audio file is ${fileSizeInMB.toFixed(2)}MB, compressing to meet 25MB limit...`);
      
      // Try to compress the audio file using ffmpeg
      const compressedPath = audioPath.replace('.mp3', '_compressed.mp3');
      try {
        const { exec } = require('child_process');
        await new Promise((resolve, reject) => {
          exec(`ffmpeg -i "${audioPath}" -ab 64k -ar 16000 -ac 1 "${compressedPath}"`, (error: any) => {
            if (error) reject(error);
            else resolve(null);
          });
        });
        
        const compressedStats = fs.statSync(compressedPath);
        const compressedSizeInMB = compressedStats.size / (1024 * 1024);
        
        if (compressedSizeInMB <= 25) {
          console.log(`✅ Compressed to ${compressedSizeInMB.toFixed(2)}MB`);
          // Clean up original and use compressed version
          fs.unlinkSync(audioPath);
          fs.renameSync(compressedPath, audioPath);
        } else {
          console.warn(`Even compressed file is ${compressedSizeInMB.toFixed(2)}MB. Skipping.`);
          fs.unlinkSync(compressedPath);
          return null;
        }
      } catch (compressionError) {
        console.warn(`Compression failed: ${compressionError}. Skipping large file.`);
        if (fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
        return null;
      }
    }

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
      language: 'en', // Assuming English content
      prompt: 'This is a video about Digital Public Infrastructure (DPI), technology, government services, and digital transformation.',
    });

    return transcription.text;
  } catch (error) {
    console.error(`Error transcribing audio:`, error);
    return null;
  }
}

function cleanupAudioFile(audioPath: string) {
  try {
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
      console.log(`Cleaned up audio file: ${audioPath}`);
    }
  } catch (error) {
    console.warn(`Failed to cleanup audio file ${audioPath}:`, error);
  }
}

async function main() {
  console.log('🎥 Starting Whisper-based YouTube video transcription...');
  
  // Check for API key
  if (!openai.apiKey) {
    console.error('❌ OpenAI API key not found. Please set OPENAI_API_KEY environment variable.');
    process.exit(1);
  }

  let kbContent;
  try {
    kbContent = fs.readFileSync(KB_PATH, 'utf-8');
  } catch (error) {
    console.error(`❌ Failed to read knowledge base file at ${KB_PATH}:`, error);
    return;
  }

  const lines = kbContent.split('\n');
  const newLines: string[] = [];
  
  let totalVideos = 0;
  let successfulTranscriptions = 0;
  let failedTranscriptions = 0;
  let skippedVideos = 0;

  const processedVideoIds = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    newLines.push(currentLine);

    // Skip if transcript already exists
    if (i + 1 < lines.length && lines[i + 1].trim() === '**Video Transcript:**') {
      // Check if it's an actual transcript or just a placeholder
      const transcriptLine = i + 2 < lines.length ? lines[i + 2] : '';
      if (transcriptLine.includes('(No transcript found') || transcriptLine.includes('(Error fetching transcript')) {
        // Remove the placeholder transcript lines
        if (i + 2 < lines.length && lines[i + 2].startsWith('> ')) {
          i += 2; // Skip the existing placeholder
          newLines.pop(); // Remove the last line we just added
          // Don't add the transcript header and placeholder
        }
      } else {
        console.log(`✅ Transcript already exists for video on line containing "${currentLine.substring(0, 50)}..." - Skipping.`);
        skippedVideos++;
        if (i + 2 < lines.length && lines[i + 2].startsWith('> ')) i += 2;
        if (i + 1 < lines.length && lines[i + 1].trim() === '') i += 1;
        continue;
      }
    }
    
    YOUTUBE_URL_REGEX.lastIndex = 0;
    let match;
    let processedVideoForThisLine = false;

    while ((match = YOUTUBE_URL_REGEX.exec(currentLine)) !== null) {
      const matchedUrl = match[0];
      const videoId = getVideoId(matchedUrl);

      if (videoId && !processedVideoIds.has(videoId) && !processedVideoForThisLine) {
        processedVideoIds.add(videoId);
        totalVideos++;
        
        console.log(`\n🎬 Processing video ${totalVideos}: https://www.youtube.com/watch?v=${videoId}`);
        
        // Download audio
        const audioPath = await downloadAudio(videoId);
        if (!audioPath) {
          console.error(`❌ Failed to download audio for ${videoId}`);
          failedTranscriptions++;
          
          newLines.push('');
          newLines.push('**Video Transcript:**');
          newLines.push('> (Failed to download audio for transcription)');
          newLines.push('');
          processedVideoForThisLine = true;
          continue;
        }

        // Transcribe audio
        const transcript = await transcribeAudio(audioPath);
        
        if (transcript && transcript.trim()) {
          console.log(`✅ Successfully transcribed ${videoId} (${transcript.length} characters)`);
          successfulTranscriptions++;
          
          newLines.push('');
          newLines.push('**Video Transcript:**');
          // Split long transcripts into readable chunks
          const maxLineLength = 100;
          const words = transcript.split(' ');
          let currentChunk = '';
          
          for (const word of words) {
            if (currentChunk.length + word.length + 1 > maxLineLength) {
              newLines.push(`> ${currentChunk.trim()}`);
              currentChunk = word + ' ';
            } else {
              currentChunk += word + ' ';
            }
          }
          
          if (currentChunk.trim()) {
            newLines.push(`> ${currentChunk.trim()}`);
          }
          
          newLines.push('');
        } else {
          console.warn(`⚠️ Transcription failed or empty for ${videoId}`);
          failedTranscriptions++;
          
          newLines.push('');
          newLines.push('**Video Transcript:**');
          newLines.push('> (Transcription failed or produced empty result)');
          newLines.push('');
        }

        // Cleanup audio file
        cleanupAudioFile(audioPath);
        processedVideoForThisLine = true;
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  // Write updated knowledge base
  if (totalVideos > 0) {
    try {
      fs.writeFileSync(KB_PATH, newLines.join('\n'), 'utf-8');
      console.log('✅ Knowledge base updated successfully!');
    } catch (error) {
      console.error(`❌ Failed to write updated knowledge base:`, error);
      return;
    }
  }

  // Cleanup temp directory
  try {
    if (fs.existsSync(TEMP_AUDIO_DIR)) {
      fs.rmSync(TEMP_AUDIO_DIR, { recursive: true, force: true });
      console.log('🧹 Cleaned up temporary audio directory');
    }
  } catch (error) {
    console.warn('⚠️ Failed to cleanup temp directory:', error);
  }

  console.log(`\n📊 Transcription Summary:`);
  console.log(`├── Total videos processed: ${totalVideos}`);
  console.log(`├── Successful transcriptions: ${successfulTranscriptions}`);
  console.log(`├── Failed transcriptions: ${failedTranscriptions}`);
  console.log(`├── Skipped (already transcribed): ${skippedVideos}`);
  console.log(`└── Success rate: ${totalVideos > 0 ? ((successfulTranscriptions / totalVideos) * 100).toFixed(1) : 0}%`);
  
  if (successfulTranscriptions > 0) {
    console.log('\n🎉 New transcript content has been added to the knowledge base!');
    console.log('💡 Remember to regenerate embeddings to include the new content in semantic search.');
  }
}

main().catch(error => {
  console.error('💥 Unhandled error in main transcription script:', error);
  process.exit(1);
});