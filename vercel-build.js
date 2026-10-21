// This script is used by Vercel to build the project
const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Polyfill crypto for Node.js environment
if (typeof global.crypto === 'undefined') {
  global.crypto = {};
}

if (typeof global.crypto.getRandomValues === 'undefined') {
  global.crypto.getRandomValues = function(array) {
    return crypto.randomFillSync(array);
  };
}

try {
  console.log('Node.js version:', process.version);
  console.log('Current directory:', process.cwd());

  // Install dependencies without using package-lock.json
  console.log('Installing dependencies...');
  execSync('npm install --no-package-lock', { stdio: 'inherit' });

  // Run the build command with custom config
  console.log('Running Vite build with custom config...');
  execSync('npx vite build --config vite.config.vercel.js', { stdio: 'inherit' });
  console.log('Build completed successfully!');

  // Verify the build output
  const distPath = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    console.log('Build output directory exists:', distPath);
    const files = fs.readdirSync(distPath);
    console.log('Files in build output directory:', files);
  } else {
    console.error('Build output directory does not exist:', distPath);
    process.exit(1);
  }
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
