// Simplified Vite config for Vercel
const { defineConfig } = require('vite');
const vue = require('@vitejs/plugin-vue');
const path = require('path');
const fs = require('fs');

// Log environment information
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());

try {
  console.log('Available files:', fs.readdirSync('.').join(', '));
} catch (e) {
  console.error('Error listing files:', e.message);
}

// Check if src directory exists
let srcPath = path.resolve(__dirname, './src');
let srcExists = false;

try {
  srcExists = fs.existsSync(srcPath);
  console.log('src directory exists:', srcExists);
} catch (e) {
  console.error('Error checking src directory:', e.message);
}

// If src doesn't exist, try alternative paths
if (!srcExists) {
  const altPaths = [
    path.resolve(process.cwd(), './src'),
    path.resolve(process.cwd(), '../src'),
    path.resolve(process.cwd(), '../../src')
  ];

  for (const altPath of altPaths) {
    try {
      if (fs.existsSync(altPath)) {
        srcPath = altPath;
        srcExists = true;
        console.log('Found src directory at alternative path:', srcPath);
        break;
      }
    } catch (e) {
      console.error('Error checking alternative path:', altPath, e.message);
    }
  }
}

// This is a simplified Vite config for Vercel with maximum compatibility
module.exports = defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': srcPath
    }
  },
  build: {
    // Target ES2015 for maximum compatibility
    target: 'es2015',
    // Use terser for minification
    minify: 'terser',
    // Disable features that might cause issues
    terserOptions: {
      compress: {
        keep_infinity: true,
        passes: 1
      }
    },
    // Handle crypto module issues
    rollupOptions: {
      external: ['crypto'],
      output: {
        manualChunks: undefined
      }
    }
  },
  // Fix for process.env references
  define: {
    'process.env': {}
  },
  // Optimize dependencies for ES2015
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2015'
    }
  }
});
