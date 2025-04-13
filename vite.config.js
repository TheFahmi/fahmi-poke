const { defineConfig } = require('vite');
const vue = require('@vitejs/plugin-vue');
const path = require('path');

module.exports = defineConfig({
  plugins: [vue()],
  base: './',
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
      output: {
        // Pastikan ESM modul memiliki nama file yang konsisten
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Hindari hash yang terlalu panjang
        manualChunks: undefined
      }
    },
    // Ganti minifier untuk mencegah masalah ESM
    minify: 'terser',
    terserOptions: {
      format: {
        // Pastikan sintaks ES modules tetap
        ecma: 2015
      },
      compress: {
        // Hindari optimisasi yang terlalu agresif
        keep_infinity: true,
        passes: 1
      }
    }
  },
  define: {
    // Fix for crypto.getRandomValues() issue on Vercel
    'process.env': {}
  }
});
