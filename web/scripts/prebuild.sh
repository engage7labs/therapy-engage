#!/bin/bash

# Azure App Service Pre-build Script
echo "🚀 Starting pre-build process..."

# Set Node.js version
echo "📦 Setting up Node.js environment..."
export NODE_ENV=production

# Clean up previous builds
echo "🧹 Cleaning up previous builds..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies with npm ci for production builds
echo "📥 Installing dependencies..."
npm ci --only=production --no-audit --no-fund

echo "✅ Pre-build setup complete!"
