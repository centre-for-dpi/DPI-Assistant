# S3 & Slack Integration Setup Guide

This guide walks you through migrating the DPI Sage knowledge base to AWS S3 and setting up automatic document uploads from Slack.

## Table of Contents
1. [AWS S3 Setup](#aws-s3-setup)
2. [Migrate Existing Knowledge Base](#migrate-existing-knowledge-base)
3. [Slack App Setup](#slack-app-setup)
4. [Testing the Integration](#testing-the-integration)
5. [Troubleshooting](#troubleshooting)

---

## AWS S3 Setup

### Step 1: Create S3 Bucket

1. **Log in to AWS Console** and navigate to S3
2. **Create a new bucket**:
   - Bucket name: `dpi-sage-knowledge-base` (or your preferred name)
   - Region: `ap-south-1` (or your preferred region)
   - Block Public Access: **Keep enabled** (bucket should be private)
   - Versioning: **Enable** (recommended for backup)
   - Encryption: **Enable** (recommended)

### Step 2: Configure IAM Permissions

Create an IAM user or role with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject",
        "s3:HeadObject"
      ],
      "Resource": [
        "arn:aws:s3:::dpi-sage-knowledge-base",
        "arn:aws:s3:::dpi-sage-knowledge-base/*"
      ]
    }
  ]
}
```

### Step 3: Configure AWS Credentials

AWS credentials are configured via environment variables in the `.env` file.

The credentials from the `cdpi` AWS profile have been configured in `dpi-assistant/.env`:
- `AWS_ACCESS_KEY_ID` - Already set from cdpi profile
- `AWS_SECRET_ACCESS_KEY` - Already set from cdpi profile

**For Production EC2 Deployment:**
You can use IAM roles instead by attaching the appropriate IAM role to your EC2 instance and removing the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from the environment variables.

### Step 4: Update Backend Environment Variables

The main `.env` file is located at `dpi-assistant/.env`. Update the S3 bucket name:

```env
# AWS Configuration (credentials already configured from cdpi profile)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=<already_configured>
AWS_SECRET_ACCESS_KEY=<already_configured>

# Update this with your bucket name
S3_KNOWLEDGE_BASE_BUCKET=dpi-sage-knowledge-base
```

---

## Migrate Existing Knowledge Base

> **Note**: This is a **one-time migration step**. Once your files are in S3, you don't need to run this again. Future documents will be uploaded via Slack or manual S3 uploads.

### Step 1: Run the Migration Script

```bash
cd dpi-assistant/backend
npm run migrate-to-s3
```

This will:
- Upload all existing markdown files from `content/knowledge-base/` to S3
- Display a summary of successful and failed uploads
- This script can be deleted after initial migration if desired

**When to re-run this script:**
- Setting up a new environment
- Migrating to a different S3 bucket
- Recovering from data loss
- Bulk uploading new documents

### Step 2: Verify Upload

Check your S3 bucket at:
```
s3://dpi-sage-knowledge-base/knowledge-base/
```

You should see all your `.md` files.

### Step 3: Test Backend with S3

```bash
npm run build
npm start
```

Look for this in the logs:
```
✅ S3 Service initialized: dpi-sage-knowledge-base (ap-south-1)
📦 Loading knowledge base from S3...
✅ Loaded X documents from S3
📦 Storage: S3 (dpi-sage-knowledge-base)
```

---

## Slack App Setup

### Step 1: Create Slack App

1. **Go to https://api.slack.com/apps**
2. Click **"Create New App"** → **"From scratch"**
3. **App Name**: `DPI Knowledge Base Manager`
4. **Workspace**: Select your workspace
5. Click **"Create App"**

### Step 2: Configure Bot Permissions

1. In the left sidebar, go to **"OAuth & Permissions"**
2. Scroll to **"Bot Token Scopes"** and add:
   - `files:read` - View files in channels
   - `chat:write` - Send messages
   - `reactions:write` - Add emoji reactions

### Step 3: Enable Event Subscriptions

1. In the left sidebar, go to **"Event Subscriptions"**
2. **Enable Events**: Toggle to **On**
3. **Request URL**: Enter your backend URL:
   ```
   https://your-domain.com/slack/events
   ```
   Or for testing with ngrok:
   ```
   https://your-ngrok-url.ngrok.io/slack/events
   ```
4. **Subscribe to bot events**:
   - `file_shared` - A file was shared in a channel

5. Click **"Save Changes"**

### Step 4: Install App to Workspace

1. In the left sidebar, go to **"Install App"**
2. Click **"Install to Workspace"**
3. Review permissions and click **"Allow"**
4. **Copy the Bot User OAuth Token** (starts with `xoxb-`)

### Step 5: Get Signing Secret

1. In the left sidebar, go to **"Basic Information"**
2. Scroll to **"App Credentials"**
3. **Copy the Signing Secret**

### Step 6: Get Channel ID

1. Open Slack and go to the channel where you want to upload files
2. Click the channel name at the top
3. Scroll down to find the **Channel ID** (e.g., `C01234567`)

### Step 7: Invite Bot to Channel

In your Slack channel, type:
```
/invite @DPI Knowledge Base Manager
```

### Step 8: Update Backend Environment Variables

Update `dpi-assistant/.env`:

```env
# Slack Integration
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
SLACK_KNOWLEDGE_BASE_CHANNEL=C01234567
```

### Step 9: Restart Backend

```bash
npm run build
npm start
```

Look for:
```
✅ Slack Service initialized
✅ Indexing service ready for auto-indexing
```

---

## Testing the Integration

### Test 1: Upload a Markdown File

1. In your designated Slack channel, upload a test markdown file:
   ```markdown
   # Test Document

   This is a test document for the DPI Knowledge Base.
   ```

2. **Expected behavior**:
   - Bot adds ✅ reaction to the message
   - Bot posts confirmation message
   - File appears in S3 bucket
   - File is indexed in Qdrant (if vector search enabled)

### Test 2: Upload a Non-Markdown File

1. Upload a `.txt` or `.pdf` file

2. **Expected behavior**:
   - Bot adds ❌ reaction
   - Bot posts error message: "Only Markdown (.md) files are supported"

### Test 3: Query the Knowledge Base

1. Send a question to the DPI assistant that should use the newly uploaded document
2. Verify the assistant can access and cite the new document

---

## Troubleshooting

### S3 Issues

**Problem**: `AccessDenied` error when uploading to S3
- **Solution**: Check IAM permissions and AWS credentials

**Problem**: Backend still using local filesystem
- **Solution**: Verify `S3_KNOWLEDGE_BASE_BUCKET` is set in `.env`

**Problem**: Files uploaded but not accessible
- **Solution**: Check bucket permissions and region configuration

### Slack Issues

**Problem**: Webhook verification failed
- **Solution**: Check `SLACK_SIGNING_SECRET` is correct

**Problem**: Bot doesn't respond to file uploads
- **Solution**:
  - Verify bot is invited to the channel
  - Check `SLACK_KNOWLEDGE_BASE_CHANNEL` matches your channel ID
  - Ensure Event Subscriptions are enabled with correct URL

**Problem**: Bot can't download files
- **Solution**: Verify `files:read` permission is granted

**Problem**: URL verification challenge fails
- **Solution**: Make sure backend is running and accessible when you save the Event Subscription URL

### Auto-Indexing Issues

**Problem**: Files added to S3 but not indexed
- **Solution**:
  - Check if Qdrant is running: `npm run qdrant:start`
  - Verify `USE_VECTOR_SEARCH=true` in `.env`
  - Check backend logs for indexing errors

**Problem**: Manual re-index needed
- **Solution Option 1** (Specific file): Use the `/reindex` API endpoint to re-index a specific file:
  ```bash
  curl -X POST http://localhost:8080/reindex \
    -H "Content-Type: application/json" \
    -d '{"fileName": "your-file-name.pdf"}'
  ```
- **Solution Option 2** (All files): Use the `/reindex-all` API endpoint to re-index all files from S3:
  ```bash
  curl -X POST http://localhost:8080/reindex-all \
    -H "Content-Type: application/json"
  ```
- **Solution Option 3** (Local files only): Run `npm run populate-vectors` to re-index all documents from local filesystem (Note: This won't index files uploaded to S3)

---

## Architecture Overview

```
┌─────────────┐
│   Slack     │
│  Channel    │
└──────┬──────┘
       │ 1. User uploads .md file
       ▼
┌─────────────────────────────┐
│   Slack Events Webhook      │
│   POST /slack/events        │
└──────┬──────────────────────┘
       │ 2. Verify signature
       │ 3. Download file
       ▼
┌─────────────────────────────┐
│      S3 Service             │
│  Upload to S3 Bucket        │
└──────┬──────────────────────┘
       │ 4. File stored
       ▼
┌─────────────────────────────┐
│   Indexing Service          │
│  Chunk → Embed → Upload     │
└──────┬──────────────────────┘
       │ 5. Indexed
       ▼
┌─────────────────────────────┐
│    Qdrant Vector Store      │
│  Available for RAG queries  │
└─────────────────────────────┘
```

---

## Environment Variables Reference

All environment variables should be set in `dpi-assistant/.env`:

| Variable | Required | Description |
|----------|----------|-------------|
| `AWS_REGION` | Yes | AWS region for S3 bucket (already set: ap-south-1) |
| `AWS_ACCESS_KEY_ID` | Yes | AWS access key (already configured from cdpi profile) |
| `AWS_SECRET_ACCESS_KEY` | Yes | AWS secret key (already configured from cdpi profile) |
| `S3_KNOWLEDGE_BASE_BUCKET` | Yes | S3 bucket name for knowledge base |
| `SLACK_BOT_TOKEN` | Optional | Slack bot OAuth token (xoxb-...) |
| `SLACK_SIGNING_SECRET` | Optional | Slack app signing secret |
| `SLACK_KNOWLEDGE_BASE_CHANNEL` | Optional | Slack channel ID for uploads |

---

## Optional: Cleanup After Migration

After successful migration, you can optionally remove the migration script:

```bash
cd dpi-assistant/backend
rm src/scripts/migrateToS3.ts
rm lib/scripts/migrateToS3.js  # If already compiled
```

Update `package.json` to remove the migration script:
```json
{
  "scripts": {
    "migrate-to-s3": "tsc && node lib/scripts/migrateToS3.js"  // Remove this line
  }
}
```

**Keep the script if:**
- You plan to set up multiple environments
- You want to re-migrate in the future
- You bulk-upload documents periodically

---

## Next Steps

### PDF Support (Coming Soon)

To add PDF support:

1. Install PDF parsing library:
   ```bash
   npm install pdf-parse
   ```

2. Update file validation in `server.ts:498`:
   ```typescript
   if (!fileInfo.name.endsWith('.md') && !fileInfo.name.endsWith('.pdf')) {
   ```

3. Add PDF parsing logic before S3 upload

4. Convert PDF to markdown or plain text for indexing

---

## Production Deployment Checklist

- [ ] S3 bucket created with versioning and encryption
- [ ] IAM role/user configured with minimal permissions
- [ ] AWS credentials configured in `.env`
- [ ] Backend environment variables updated
- [ ] Migration completed: `npm run migrate-to-s3` (one-time)
- [ ] Backend tested with S3 integration
- [ ] Slack app created and installed
- [ ] Bot invited to designated channel
- [ ] Event subscription URL verified
- [ ] Test file upload successful
- [ ] Auto-indexing verified
- [ ] Monitoring and logging configured
- [ ] `docker-compose.prod.yml` updated with all environment variables

---

## Support

For issues or questions:
- Check logs: `npm run docker:logs`
- Verify environment variables: `cat .env`
- Test AWS credentials: `aws s3 ls s3://your-bucket-name`
- Test Slack webhook: Use Slack API tester
