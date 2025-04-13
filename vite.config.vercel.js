// Use try-catch to handle potential errors
try {
  const { defineConfig } = require('vite');
  const vue = require('@vitejs/plugin-vue');
  const path = require('path');
  const fs = require('fs');

  // Log environment information
  console.log('Node.js version:', process.version);
  console.log('Current directory:', process.cwd());
  console.log('Available files:', fs.readdirSync('.').join(', '));

  // Check if src directory exists
  const srcPath = path.resolve(__dirname, './src');
  const srcExists = fs.existsSync(srcPath);
  console.log('src directory exists:', srcExists);

  // This is a special Vite config for Vercel with maximum compatibility
  const config = {
    plugins: [vue()],
    base: './',
    resolve: {
      alias: {
        '@': srcPath
      }
    },
    // Compatibility settings for Node.js 16
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          // Disable features that might cause issues
          keep_infinity: true,
          passes: 1
        }
      },
      rollupOptions: {
        external: ['crypto'],
        output: {
          manualChunks: undefined
        }
      }
    },
    define: {
      'process.env': {}
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2015'
      }
    }
  };

  console.log('Vite config created successfully');
  module.exports = defineConfig(config);
} catch (error) {
  console.error('Error in vite.config.vercel.js:', error);

  // Provide a minimal fallback config
  try {
    const { defineConfig } = require('vite');
    const vue = require('@vitejs/plugin-vue');

    console.log('Using minimal fallback config');
    module.exports = defineConfig({
      plugins: [vue()],
      base: './'
    });
  } catch (fallbackError) {
    console.error('Error creating fallback config:', fallbackError);
    // Export an empty object as a last resort
    module.exports = {};
  }
}
