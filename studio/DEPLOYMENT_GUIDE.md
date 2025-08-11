# Deployment Guide for DPI Sage Quick Actions

## Prerequisites
1. Firebase CLI installed (`npm install -g firebase-tools`)
2. Node.js 18+ installed
3. Access to the Firebase project (dpi-sage-2607)

## Step-by-Step Deployment

### 1. First, authenticate with Firebase:
```bash
firebase login
```

### 2. Build the Next.js application:
```bash
cd /Users/anusreejayakrishnan/dpi\ coach/studio
npm run build
```

### 3. Export static files for Firebase Hosting:
```bash
npx next export
```

### 4. Build Firebase Functions:
```bash
cd functions
npm run build
cd ..
```

### 5. Deploy everything to Firebase:
```bash
firebase deploy
```

## Alternative: Use the deployment script
After logging in to Firebase, you can use the automated script:
```bash
cd /Users/anusreejayakrishnan/dpi\ coach/studio
./deploy.sh
```

## What's Being Deployed

### Frontend Changes:
- **Quick Actions Component** on the home page
- **Quick Actions button** in the chat interface
- File upload capability for strategy documents

### Backend Changes:
- Updated chat endpoint to handle Quick Actions
- Support for three action types:
  - Analyze Strategy Document
  - Draft Email
  - Create Strategy Note

## Post-Deployment Verification

1. Visit https://dpi-sage-2607.web.app
2. Check that Quick Actions appear on the home page
3. Test the chat interface Quick Actions button
4. Try each action to ensure they work correctly

## Troubleshooting

### If build fails:
- Check for TypeScript errors: `npm run typecheck`
- Check for linting errors: `npm run lint`

### If deployment fails:
- Ensure you have proper permissions to the Firebase project
- Check that all dependencies are installed in both root and functions directories
- Review firebase-debug.log for detailed error messages

### If functions don't work:
- Check the Firebase Functions logs: `firebase functions:log`
- Ensure environment variables are set in Firebase (if any)

## Rollback (if needed)
To rollback to the previous version:
```bash
firebase hosting:rollback
firebase functions:rollback
```
