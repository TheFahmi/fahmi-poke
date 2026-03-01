<template>
  <div class="max-w-7xl mx-auto">
    <!-- Caught Header -->
    <div class="mb-6 text-center">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Caught Pokémon</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm">Your collection of caught Pokémon</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !showSkeleton" class="flex flex-col items-center justify-center py-16">
      <div class="w-10 h-10 rounded-full border-3 border-gray-200 dark:border-primary-700 border-t-accent animate-spin mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400 text-sm">Loading caught Pokémon...</p>
    </div>
    <!-- Caught Grid -->
    <div v-if="caughtPokemon.length > 0" class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <PokemonCard
        v-for="pokemon in caughtPokemon"
        :key="pokemon.id"
        :pokemon="pokemon"
        @select-pokemon="selectPokemon"
        @view-details="viewDetails"
        @toggle-catch="handleToggleCatch"
      />
    </div>

    <!-- Skeleton Loading -->
    <div v-else-if="isLoading && showSkeleton" class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <PokemonSkeleton v-for="n in 6" :key="n" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && caughtPokemon.length === 0" class="flex flex-col items-center justify-center py-20 px-4">
      <svg class="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">No Caught Pokémon</h3>
      <p class="text-gray-500 dark:text-gray-400 text-sm text-center mb-4">You haven't caught any Pokémon yet.</p>
      <button
        @click.prevent.stop="goToAllPokemon"
        class="px-5 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors"
      >
        Browse Pokémon
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import PokemonCard from './PokemonCard.vue'
import PokemonSkeleton from './PokemonSkeleton.vue'

const emit = defineEmits(['select-pokemon', 'change-tab'])

const showSkeleton = ref(false)

const pokemonStore = usePokemonStore()
const {
  pokemons,
  toggleCatch,
  isLoading,
  loadCaughtPokemons
} = pokemonStore

const caughtPokemon = computed(() => {
  if (!pokemons || !Array.isArray(pokemons)) {
    return [];
  }
  return pokemons.filter(pokemon => pokemon.isCaught === true);
})

const selectPokemon = (pokemon) => {
  emit('select-pokemon', pokemon)
}

const viewDetails = (pokemon) => {
  emit('select-pokemon', pokemon)
}

const handleToggleCatch = (pokemon) => {
  toggleCatch(pokemon)
}

const goToAllPokemon = () => {
  try {
    const event = new CustomEvent('change-pokemon-tab', { detail: 'listPokemon' })
    document.dispatchEvent(event)
    emit('change-tab', 'listPokemon')
  } catch (error) {
    console.error('Error navigating to All Pokemon:', error)
  }
}

onMounted(() => {
  try {
    showSkeleton.value = pokemons.length > 0
    loadCaughtPokemons()
  } catch (error) {
    console.error('Error in PokemonCaught onMounted:', error)
  }
})
</script>
