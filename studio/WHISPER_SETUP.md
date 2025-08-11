# YouTube Video Transcription with OpenAI Whisper

## Setup Instructions

### 1. Install Dependencies

```bash
# Install Node dependencies (already done)
npm install openai yt-dlp-wrap

# Install yt-dlp binary (already done)
pip3 install yt-dlp
```

### 2. Configure Environment Variables

Create a `.env.local` file in the studio directory:

```bash
cp .env.example .env.local
```

Add your OpenAI API key to `.env.local`:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run Transcription

```bash
# Run the Whisper transcription script
npx tsx scripts/whisper-transcribe-videos.ts
```

## What It Does

1. **Scans** the knowledge base for YouTube URLs
2. **Downloads** audio from YouTube videos using yt-dlp
3. **Transcribes** audio using OpenAI Whisper API
4. **Updates** the knowledge base with transcripts
5. **Cleans up** temporary audio files

## Features

- ✅ **Smart caching** - skips already transcribed videos
- ✅ **File size limits** - respects OpenAI's 25MB limit
- ✅ **Error handling** - graceful failure with status messages
- ✅ **Rate limiting** - includes delays to avoid API limits
- ✅ **Progress tracking** - detailed logging and statistics
- ✅ **Cleanup** - removes temporary files after processing

## Cost Considerations

- OpenAI Whisper costs $0.006 per minute of audio
- Average YouTube video (10-15 minutes) costs ~$0.06-0.09
- 38 videos estimated cost: ~$2.28-3.42

## Output Format

Transcripts are added to the knowledge base in this format:

```markdown
**Video Transcript:**
> This is the transcribed content from the video split into
> readable lines for better formatting and searchability.
```

## Troubleshooting

**Error: "yt-dlp not found"**
- Make sure yt-dlp is installed: `pip3 install yt-dlp`
- Check PATH includes Python bin directory

**Error: "OpenAI API key not found"**
- Ensure `.env.local` exists with `OPENAI_API_KEY`
- Verify the API key is valid and has credits

**Audio download fails**
- Some videos may be geo-restricted or private
- The script will mark these as failed and continue

**File size too large**
- Videos over 25MB audio will be skipped
- Consider using shorter video segments if needed