// Polyfill for crypto.getRandomValues
if (typeof window !== 'undefined' && !window.crypto) {
  window.crypto = {};
}
if (typeof window !== 'undefined' && !window.crypto.getRandomValues) {
  window.crypto.getRandomValues = function(array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  };
}

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './tailwind.css'
import App from './App.vue'
import { routes } from './routes.js'
import VLazyImage from 'v-lazy-image'
import { createRouter, createWebHistory } from 'vue-router'
import { usePokemonStore } from './stores/pokemon'

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create the Pinia store with debuggin
const pinia = createPinia()

// Add a debug plugin for Pinia
pinia.use(({ store }) => {
  // Whenever the store changes, log the event
  console.log(`[Pinia Debug] ${store.$id} initialized`)

  // Whenever the store changes, log the event
  store.$subscribe((mutation, state) => {
    console.log(`[Pinia Debug] ${store.$id} changed:`, mutation.type)
  })
})

// Create the Vue app
const app = createApp(App)

// Use plugins
app.use(pinia)
app.use(router)
app.use(VLazyImage)

// Inisialisasi Pokemon Store sebelum aplikasi dimulai
const initializeStore = async () => {
  try {
    console.log('📱 Inisialisasi Pokemon Store dari main.js...')
    const pokemonStore = usePokemonStore()

    // Coba cek apakah store memiliki data
    if (!pokemonStore.pokemons || pokemonStore.pokemons.length === 0) {
      console.log('🚀 Memulai init() dari main.js - tidak ada data')
      const result = pokemonStore.init()
      console.log('✅ Hasil inisialisasi store dari main.js:', result)

      // Mekanisme darurat - pastikan data dimuat
      setTimeout(() => {
        try {
          if (!pokemonStore.pokemons || pokemonStore.pokemons.length === 0) {
            console.log('⚠️ Belum ada data setelah init, mencoba loadFallbackData')
            pokemonStore.loadFallbackData()
          }
        } catch (err) {
          console.error('💥 Error dalam timeout emergency check:', err)
        }
      }, 2000)
    } else {
      console.log('📊 Store sudah memiliki data:', pokemonStore.pokemons.length, 'pokemon')
    }

    // Store akses global untuk debugging
    window.pokemonStore = pokemonStore
    console.log('🌐 Store tersedia sebagai window.pokemonStore untuk debugging')

    return true
  } catch (error) {
    console.error('💥 Gagal menginisialisasi store dari main.js:', error)

    // Jangan biarkan error menghentikan pemasangan aplikasi
    return false
  }
}

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue global error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)

  // Pesan error yang lebih ramah pengguna
  if (err.message && err.message.includes('pokemon')) {
    console.log('Mencoba memulihkan dari error Pokemon...')
    try {
      const pokemonStore = usePokemonStore()
      pokemonStore.loadFallbackData()
    } catch (e) {
      console.error('Gagal memulihkan dari error:', e)
    }
  }
}

// Inisialisasi store terlebih dahulu, kemudian pasang aplikasi
initializeStore().then(() => {
  // Mount the app
  app.mount('#app')
  console.log('🎮 Aplikasi berhasil dimulai')
})
