<template>
  <div class="app-container min-h-screen bg-primary-950">
    <!-- Splash Screen -->
    <SplashScreen v-if="showSplash" @complete="splashComplete" :duration="3000" />
    
    <!-- Main App Content -->
    <div v-show="!showSplash" class="animate-fade-in">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { RouterView } from 'vue-router'
import SplashScreen from './components/SplashScreen.vue'
import { usePokemonStore } from '@/stores/pokemon'

const showSplash = ref(true)
const splashComplete = () => {
  showSplash.value = false
}

const pokemonStore = usePokemonStore()

onMounted(() => {
  pokemonStore.fetchPokemons()
})
</script>

<style>
/* Global transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Selection color */
::selection {
  background-color: rgba(99, 102, 241, 0.3);
  color: white;
}
</style>
