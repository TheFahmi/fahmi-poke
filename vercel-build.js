// This script is used by Vercel to build the project
const { execSync } = require('child_process');
const crypto = require('crypto');

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
  // Run the build command
  console.log('Running Vite build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
