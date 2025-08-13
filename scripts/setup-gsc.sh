#!/bin/bash

# Google Search Console Setup Script
# This script helps set up the GSC integration

echo "🔧 Google Search Console Integration Setup"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install required dependencies
echo "📦 Installing required dependencies..."
npm install googleapis fs-extra

# Create credentials template
cat > gsc-credentials-template.json << EOF
{
  "type": "service_account",
  "project_id": "your-google-cloud-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com"
}
EOF

echo ""
echo "📋 Setup Instructions:"
echo "1. Go to Google Cloud Console (https://console.cloud.google.com/)"
echo "2. Create a new project or select existing one"
echo "3. Enable the Search Console API"
echo "4. Create a Service Account:"
echo "   - Go to IAM & Admin > Service Accounts"
echo "   - Click 'Create Service Account'"
echo "   - Download the JSON key file"
echo "5. Copy the downloaded JSON to 'gsc-credentials.json'"
echo "6. Go to Google Search Console (https://search.google.com/search-console)"
echo "7. Add the service account email as a user with 'Full' permissions"
echo ""
echo "📄 Template credentials file created: gsc-credentials-template.json"
echo "📝 Replace with your actual credentials and rename to: gsc-credentials.json"
echo ""
echo "🚀 After setup, run: node scripts/gsc-integration.js"