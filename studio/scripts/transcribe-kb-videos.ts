
import fs from 'fs';
import path from 'path';
import { YoutubeTranscript, YoutubeTranscriptError } from 'youtube-transcript';

const KB_PATH = path.join(process.cwd(), 'src', 'content', 'knowledge-base', 'main-kb.md');
const YOUTUBE_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:[^&\s]*&)*v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;

function getVideoId(url: string): string | null {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[1] && match[1].length === 11) ? match[1] : null;
}

async function main() {
  console.log(`Starting transcription process for ${KB_PATH}...`);

  let kbContent;
  try {
    kbContent = fs.readFileSync(KB_PATH, 'utf-8');
  } catch (error) {
    console.error(`Failed to read knowledge base file at ${KB_PATH}:`, error);
    return;
  }

  const lines = kbContent.split(`
`);
  const newLines: string[] = [];
  
  let overallPotentialVideosFound = 0;
  let videosSuccessfullyTranscribed = 0;
  let videosWithNoTranscript = 0;
  let transcriptionErrors = 0;

  const processedVideoIdsOnLine = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    newLines.push(currentLine);
    processedVideoIdsOnLine.clear();

    if (i + 1 < lines.length && lines[i + 1].trim() === '**Video Transcript:**') {
      console.log(`Transcript seems to already exist for video(s) on line containing "${currentLine.substring(0,50)}..." - Skipping line for new transcription.`);
      if (i + 2 < lines.length && lines[i+2].startsWith('> ')) i += 2; 
      if (i + 1 < lines.length && lines[i+1].trim() === '') i +=1;
      continue; 
    }
    
    YOUTUBE_URL_REGEX.lastIndex = 0;
    let match;
    let wroteTranscriptForThisKBLine = false;

    while((match = YOUTUBE_URL_REGEX.exec(currentLine)) !== null) {
      const matchedUrl = match[0];
      const videoId = getVideoId(matchedUrl);

      if (videoId) {
        if (processedVideoIdsOnLine.has(videoId)) {
          continue;
        }
        processedVideoIdsOnLine.add(videoId);
        overallPotentialVideosFound++;

        if (wroteTranscriptForThisKBLine) {
            console.log(`Skipping duplicate video processing on same KB line for ID: ${videoId}`);
            continue;
        }

        console.log(`Attempting to transcribe: https://www.youtube.com/watch?v=${videoId} (ID: ${videoId}) from matched URL: ${matchedUrl}`);
        try {
          const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
          if (transcriptItems && transcriptItems.length > 0) {
            const fullTranscript = transcriptItems.map(item => item.text).join(' ');
            newLines.push('');
            newLines.push('**Video Transcript:**');
            newLines.push(`> ${fullTranscript}`);
            newLines.push('');
            console.log(`Successfully transcribed and added: https://www.youtube.com/watch?v=${videoId}`);
            videosSuccessfullyTranscribed++;
            wroteTranscriptForThisKBLine = true;
          } else {
            newLines.push('');
            newLines.push('**Video Transcript:**');
            newLines.push('> (No transcript found or transcript was empty)');
            newLines.push('');
            console.warn(`No transcript found or transcript was empty for: https://www.youtube.com/watch?v=${videoId}`);
            videosWithNoTranscript++;
            wroteTranscriptForThisKBLine = true;
          }
        } catch (err: any) {
          transcriptionErrors++;
          newLines.push('');
          newLines.push('**Video Transcript:**');
          if (err instanceof YoutubeTranscriptError) {
            newLines.push(`> (Error fetching transcript: ${err.message})`);
            console.error(`Error transcribing https://www.youtube.com/watch?v=${videoId}: ${err.message}`);
          } else {
            newLines.push(`> (An unexpected error occurred during transcription: ${err.message || 'Unknown error'})`);
            console.error(`Unexpected error transcribing https://www.youtube.com/watch?v=${videoId}:`, err);
          }
          newLines.push('');
          wroteTranscriptForThisKBLine = true;
        }
      }
    }
  }

  if (overallPotentialVideosFound > 0 || lines.length !== newLines.length) {
    try {
      fs.writeFileSync(KB_PATH, newLines.join(`
`), 'utf-8');
      console.log('Knowledge base update process complete!');
    } catch (error) {
      console.error(`Failed to write updated knowledge base file to ${KB_PATH}:`, error);
    }
  } else {
    console.log('No new YouTube URLs requiring transcription found, or no changes made to the knowledge base.');
  }
  
  console.log(`
--- Transcription Summary ---`);
  console.log(`Total unique YouTube video IDs processed: ${overallPotentialVideosFound}`);
  console.log(`Successfully transcribed: ${videosSuccessfullyTranscribed}`);
  console.log(`Videos with no transcript (unavailable/empty): ${videosWithNoTranscript}`);
  console.log(`Errors encountered during transcription: ${transcriptionErrors}`);
}

main().catch(error => {
  console.error("Unhandled error in main transcription script:", error);
});
