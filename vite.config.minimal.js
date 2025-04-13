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
    minify: 'terser',
    sourcemap: false,
    // Target lowest common denominator for maksimum kompatibilitas
    target: 'es2015',
    // Avoid chunking
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    terserOptions: {
      compress: {
        // Disable fitur yang mungkin menyebabkan masalah
        keep_infinity: true,
        passes: 1
      }
    }
  }
});
