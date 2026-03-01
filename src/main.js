// Polyfill for crypto.getRandomValues
if (typeof window !== 'undefined') {
  if (!window.crypto) {
    window.crypto = {};
  }

  if (!window.crypto.getRandomValues) {
    window.crypto.getRandomValues = function(array) {
      const getRandomValue = () => Math.floor(Math.random() * 256);

      if (array instanceof Uint8Array) {
        for (let i = 0; i < array.length; i++) {
          array[i] = getRandomValue();
        }
      } else if (Array.isArray(array)) {
        for (let i = 0; i < array.length; i++) {
          array[i] = getRandomValue();
        }
      }

      return array;
    };
  }
}

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './tailwind.css'
import App from './App.vue'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import { usePokemonStore } from './stores/pokemon'

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create the Pinia store
const pinia = createPinia()

// Create the Vue app
const app = createApp(App)

// Use plugins
app.use(pinia)
app.use(router)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue global error:', err)
  console.error('Info:', info)

  // Try to recover from Pokemon-related errors
  if (err.message && err.message.includes('pokemon')) {
    try {
      const pokemonStore = usePokemonStore()
      pokemonStore.loadFallbackData()
    } catch (e) {
      console.error('Failed to recover:', e)
    }
  }
}

// Initialize store then mount app
const initializeStore = async () => {
  try {
    const pokemonStore = usePokemonStore()

    if (!pokemonStore.pokemons || pokemonStore.pokemons.length === 0) {
      pokemonStore.init()

      // Emergency fallback
      setTimeout(() => {
        try {
          if (!pokemonStore.pokemons || pokemonStore.pokemons.length === 0) {
            pokemonStore.loadFallbackData()
          }
        } catch (err) {
          console.error('Error in fallback check:', err)
        }
      }, 2000)
    }

    return true
  } catch (error) {
    console.error('Failed to initialize store:', error)
    return false
  }
}

initializeStore().then(() => {
  app.mount('#app')
}).catch(err => {
  console.error('Fatal error during app initialization:', err)
  app.mount('#app')
})
