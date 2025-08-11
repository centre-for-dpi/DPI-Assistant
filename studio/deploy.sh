#!/bin/bash

echo "🚀 Starting deployment of DPI Sage..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Build the Next.js app (includes export with output: 'export' in next.config.ts)
echo "📦 Building and exporting Next.js application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors above."
    exit 1
fi

# Build Firebase Functions
echo "🔧 Building Firebase Functions..."
cd functions
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Functions build failed. Please fix the errors above."
    exit 1
fi
cd ..

# Deploy to Firebase
echo "☁️  Deploying to Firebase..."
firebase deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful! Your changes are now live."
    echo "🌐 Visit your site at: https://dpi-sage-2607.web.app"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
