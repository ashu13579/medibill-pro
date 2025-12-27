#!/bin/bash

# MediBill Pro - One-Click Deployment Script
# This script helps you deploy MediBill Pro to various platforms

echo "🚀 MediBill Pro Deployment Helper"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is installed: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"
echo ""

# Deployment options
echo "🌐 Choose your deployment platform:"
echo ""
echo "1. Netlify (Recommended - Free, Easy)"
echo "2. Vercel (Fast, Optimized)"
echo "3. GitHub Pages (Free Hosting)"
echo "4. Manual (Copy build folder)"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📘 Deploying to Netlify..."
        echo ""
        echo "Option A: Drag & Drop (Easiest)"
        echo "  1. Go to https://app.netlify.com/drop"
        echo "  2. Drag the 'build' folder to the upload area"
        echo "  3. Your site will be live instantly!"
        echo ""
        echo "Option B: Netlify CLI"
        echo "  Run: npm install -g netlify-cli"
        echo "  Then: netlify deploy --prod --dir=build"
        echo ""
        ;;
    2)
        echo ""
        echo "📗 Deploying to Vercel..."
        echo ""
        echo "Option A: Vercel Dashboard"
        echo "  1. Go to https://vercel.com/new"
        echo "  2. Import your GitHub repository"
        echo "  3. Click Deploy"
        echo ""
        echo "Option B: Vercel CLI"
        echo "  Run: npm install -g vercel"
        echo "  Then: vercel --prod"
        echo ""
        ;;
    3)
        echo ""
        echo "📙 Deploying to GitHub Pages..."
        echo ""
        echo "Run these commands:"
        echo "  npm install --save-dev gh-pages"
        echo "  npm run deploy"
        echo ""
        echo "Then enable GitHub Pages in repository settings"
        echo ""
        ;;
    4)
        echo ""
        echo "📦 Manual Deployment"
        echo ""
        echo "Your build is ready in the 'build' folder"
        echo "Copy the contents to your web server"
        echo ""
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✨ Deployment preparation complete!"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "🐛 Issues? Visit: https://github.com/ashu13579/medibill-pro/issues"
echo ""
echo "🎉 Thank you for using MediBill Pro!"