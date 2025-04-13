const { defineConfig } = require('vite');
const vue = require('@vitejs/plugin-vue');
const path = require('path');

// This is a special Vite config for Vercel
module.exports = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
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
});
