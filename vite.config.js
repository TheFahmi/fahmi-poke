const { defineConfig } = require('vite');
const vue = require('@vitejs/plugin-vue');
const path = require('path');

module.exports = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000
  },
  build: {
    // Fix for crypto.getRandomValues() issue on Vercel
    rollupOptions: {
      external: ['crypto'],
    },
  },
  define: {
    // Fix for crypto.getRandomValues() issue on Vercel
    'process.env': {}
  }
});
