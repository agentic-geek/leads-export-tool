#!/bin/bash
# This script is used by Render.com to build the application

# Exit on error
set -e

# Print commands
set -x

# Install dependencies
npm install

# Build the application
npm run build

echo "Build completed successfully!"