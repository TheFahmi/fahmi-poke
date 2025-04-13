// Minimal Vite configuration for Vercel
const { defineConfig } = require('vite');
const vue = require('@vitejs/plugin-vue');

console.log('Using minimal Vite configuration');

module.exports = defineConfig({
  // Only essential plugins
  plugins: [vue()],
  // Use relative paths
  base: './',
  // Simplest possible build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    sourcemap: false,
    // Avoid any advanced features
    target: 'es2015',
    // Avoid chunking
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
