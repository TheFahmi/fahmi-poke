import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import postcss from './postcss.config.js'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  server: {
    open: true,
  },
  optimizeDeps: {
    include: ['vue3-circle-progress/dist/circle-progress.umd.min.js']
  },
  css: {
    postcss
  }
})
