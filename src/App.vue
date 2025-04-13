<template>
  <!-- Splash Screen -->
  <SplashScreen v-if="showSplash" @complete="showSplash = false" :duration="2500" />

  <Suspense>
    <template #default>
      <div id="app" class="min-h-screen">
        <!-- Store Debug Panel -->
        <div v-if="showDebug" class="fixed bottom-0 left-0 z-50 bg-black/90 text-white p-2 text-xs max-w-xs overflow-auto max-h-60">
          <div class="flex justify-between mb-1">
            <h3 class="font-bold">Store Debug</h3>
            <button @click="showDebug = false" class="text-red-400 px-1">×</button>
          </div>
          <div>
            <p>Init Called: {{ storeInitialized ? 'Yes' : 'No' }}</p>
            <p>Pokemon: {{ pokemonStore?.pokemons?.length || 0 }}</p>
            <p>Types: {{ pokemonStore?.pokemonTypes?.length || 0 }}</p>
            <p>Loading: {{ pokemonStore?.isLoading || false }}</p>
            <div class="mt-1 flex space-x-1">
              <button @click="forceInit" class="bg-blue-700 text-white text-xs px-1 py-0.5 rounded">Init</button>
              <button @click="forceLoad" class="bg-green-700 text-white text-xs px-1 py-0.5 rounded">Load</button>
              <button @click="forceReset" class="bg-red-700 text-white text-xs px-1 py-0.5 rounded">Reset</button>
            </div>
          </div>
        </div>

        <button
          v-if="!showDebug"
          @click="showDebug = true"
          class="fixed bottom-0 left-0 z-50 bg-gray-800 text-white px-2 py-1 text-xs opacity-50 hover:opacity-100"
        >
          Debug
        </button>

        <Pokemon />
      </div>
    </template>
    <template #fallback>
      <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pokemon-yellow via-pokemon-red to-pokemon-blue">
        <img
          alt="Pokémon logo"
          src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"
          class="w-64 mb-8 animate-pulse"
        >
        <div class="text-center">
          <div class="bg-white/20 backdrop-blur-md rounded-lg p-8 shadow-xl">
            <h2 class="text-2xl font-bold text-white mb-4">Memuat Pokédex...</h2>
            <div class="flex justify-center space-x-2">
              <div class="w-4 h-4 bg-white rounded-full animate-bounce"></div>
              <div class="w-4 h-4 bg-white rounded-full animate-bounce delay-150"></div>
              <div class="w-4 h-4 bg-white rounded-full animate-bounce delay-300"></div>
            </div>
            <p class="text-white/70 mt-4">Sedang menginisialisasi data Pokemon...</p>
          </div>
        </div>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import Pokemon from './components/Pokemon.vue'
import SplashScreen from './components/SplashScreen.vue'
import { ref, onMounted, onUnmounted, provide } from 'vue'
import { usePokemonStore } from './stores/pokemon'

// Splash screen state
const showSplash = ref(true)

// Debug state
const showDebug = ref(false)
const storeInitialized = ref(false)
const storeLoaded = ref(false)

// Get store
const pokemonStore = usePokemonStore()

// Provide store to components
provide('pokemonStore', pokemonStore)

// Debug actions
const forceInit = () => {
  console.log('Force init from App.vue')
  try {
    pokemonStore.init()
    storeInitialized.value = true
  } catch (error) {
    console.error('Force init failed:', error)
    alert('Init failed: ' + error.message)
  }
}

const forceLoad = () => {
  console.log('Force load from App.vue')
  try {
    pokemonStore.fetchPokemons()
    pokemonStore.fetchPokemonTypes()
    storeLoaded.value = true
  } catch (error) {
    console.error('Force load failed:', error)
    alert('Load failed: ' + error.message)
  }
}

const forceReset = () => {
  console.log('Force reset from App.vue')
  try {
    pokemonStore.$reset()
    pokemonStore.pokemons = []
    pokemonStore.pokemonTypes = []
    pokemonStore.nextUrl = ''
    pokemonStore.isLoading = false
    storeInitialized.value = false
    storeLoaded.value = false
  } catch (error) {
    console.error('Force reset failed:', error)
    alert('Reset failed: ' + error.message)
  }
}

// Initialize store
onMounted(() => {
  console.log('App.vue mounted')

  // Initialize on mount
  try {
    // Check if store already has data
    if (pokemonStore.pokemons && pokemonStore.pokemons.length > 0) {
      console.log('Store already has data:', pokemonStore.pokemons.length, 'pokemon')
      storeInitialized.value = true
      storeLoaded.value = true
      return
    }

    // Initialize store
    console.log('Initializing store from App.vue')
    pokemonStore.init()
    storeInitialized.value = true

    // Check if data was loaded after a delay
    setTimeout(() => {
      if (!pokemonStore.pokemons || pokemonStore.pokemons.length === 0) {
        console.warn('No pokemon data after init, forcing fallback data')
        pokemonStore.loadFallbackData()
      } else {
        console.log('Store initialized successfully with', pokemonStore.pokemons.length, 'pokemon')
        storeLoaded.value = true
      }
    }, 3000)
  } catch (error) {
    console.error('Failed to initialize store:', error)

    // Try to recover with fallback data
    try {
      console.log('Attempting to load fallback data after init failure')
      pokemonStore.loadFallbackData()
    } catch (fallbackError) {
      console.error('Fallback data load failed:', fallbackError)
    }
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffbf0b 0%, #e20000 100%);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Type colors for fallback */
.type-normal { background-color: #A8A878; }
.type-fire { background-color: #F08030; }
.type-water { background-color: #6890F0; }
.type-grass { background-color: #78C850; }
.type-electric { background-color: #F8D030; }
.type-ice { background-color: #98D8D8; }
.type-fighting { background-color: #C03028; }
.type-poison { background-color: #A040A0; }
.type-ground { background-color: #E0C068; }
.type-flying { background-color: #A890F0; }
.type-psychic { background-color: #F85888; }
.type-bug { background-color: #A8B820; }
.type-rock { background-color: #B8A038; }
.type-ghost { background-color: #705898; }
.type-dragon { background-color: #7038F8; }
.type-dark { background-color: #705848; }
.type-steel { background-color: #B8B8D0; }
.type-fairy { background-color: #EE99AC; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.delay-150 {
  animation-delay: 0.15s;
}

.delay-300 {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-10px);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
