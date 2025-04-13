#!/bin/bash
set -e

# Print Node.js version
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies without using package-lock.json
echo "Installing dependencies..."
npm install --no-package-lock

# Run the build command with custom config
echo "Running Vite build with custom config..."
npx vite build --config vite.config.vercel.js

# Verify the build output
echo "Verifying build output..."
if [ -d "dist" ]; then
  echo "Build output directory exists: $(pwd)/dist"
  echo "Files in build output directory:"
  ls -la dist
else
  echo "Build output directory does not exist: $(pwd)/dist"
  exit 1
fi

echo "Build completed successfully!"
