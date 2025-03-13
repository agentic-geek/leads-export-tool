#!/bin/bash
# This script is used by Render.com to build the application

# Exit on error
set -e

# Print commands
set -x

# Install dependencies
npm install

# Test Google Cloud credentials (if available)
if [ -n "$GOOGLE_APPLICATION_CREDENTIALS_JSON" ]; then
  echo "Testing Google Cloud credentials..."
  npm run test-credentials
fi

# Build the application
npm run build

echo "Build completed successfully!"