
'use server';
/**
 * @fileOverview A Genkit tool to transcribe YouTube videos.
 *
 * - transcribeYouTubeVideoTool - A tool that fetches a YouTube video transcript.
 * - TranscribeYouTubeVideoInput - The input type for the transcribeYouTubeVideoTool.
 * - TranscribeYouTubeVideoOutput - The return type for the transcribeYouTubeVideoTool.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { YoutubeTranscript, YoutubeTranscriptError } from 'youtube-transcript';

const TranscribeYouTubeVideoInputSchema = z.object({
  url: z.string().url().describe('The URL of the YouTube video to transcribe (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID).'),
});
export type TranscribeYouTubeVideoInput = z.infer<typeof TranscribeYouTubeVideoInputSchema>;

const TranscribeYouTubeVideoOutputSchema = z.object({
  transcript: z.string().optional().describe('The extracted textual transcript from the YouTube video. May be truncated if very long.'),
  error: z.string().optional().describe('An error message if transcription failed (e.g., no transcript available, invalid URL).'),
  url: z.string().url().describe('The original YouTube URL that was processed.'),
});
export type TranscribeYouTubeVideoOutput = z.infer<typeof TranscribeYouTubeVideoOutputSchema>;

// Helper function to extract video ID from various YouTube URL formats
function getVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export const transcribeYouTubeVideoTool = ai.defineTool(
  {
    name: 'transcribeYouTubeVideoTool',
    description: 'Fetches the available transcript (captions) for a given YouTube video URL. Use this if the knowledge base refers to a YouTube video and you need to access its spoken content to answer a question.',
    inputSchema: TranscribeYouTubeVideoInputSchema,
    outputSchema: TranscribeYouTubeVideoOutputSchema,
  },
  async (input: TranscribeYouTubeVideoInput): Promise<TranscribeYouTubeVideoOutput> => {
    const videoId = getVideoId(input.url);

    if (!videoId) {
      return { url: input.url, error: 'Invalid YouTube URL or could not extract video ID.' };
    }

    try {
      const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
      if (!transcriptItems || transcriptItems.length === 0) {
        return { url: input.url, error: 'No transcript found for this video.' };
      }

      let fullTranscript = transcriptItems.map(item => item.text).join(' ');
      
      const MAX_LENGTH = 5000; // Limit content length
      if (fullTranscript.length > MAX_LENGTH) {
        fullTranscript = fullTranscript.substring(0, MAX_LENGTH) + "... (transcript truncated)";
      }

      return { url: input.url, transcript: fullTranscript };
    } catch (err: any) {
      console.error(`Error transcribing YouTube video ${input.url} (ID: ${videoId}):`, err.message);
      if (err instanceof YoutubeTranscriptError) {
         return { url: input.url, error: `Failed to fetch transcript: ${err.message}. This often means no transcript is available or the video is private.` };
      }
      return { url: input.url, error: `Failed to transcribe video: ${err.message || 'Unknown error'}` };
    }
  }
);
