<template>
  <div class="max-w-7xl mx-auto">
    <!-- Favorites Header -->
    <div class="mb-8 text-center">
      <h2 class="text-2xl font-bold text-white mb-2">Your Favorite Pokémon</h2>
      <p class="text-white/80">Manage your collection of favorite Pokémon</p>
    </div>

    <!-- Favorites Grid -->
    <div v-if="favorites.length > 0" class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <PokemonCard
        v-for="pokemon in favorites"
        :key="pokemon.id"
        :pokemon="pokemon"
        @select-pokemon="selectPokemon"
        @view-details="viewDetails"
        @toggle-favorite="handleToggleFavorite"
      />
    </div>

    <!-- Skeleton Loading -->
    <div v-else-if="isLoading" class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <PokemonSkeleton v-for="n in 6" :key="n" />
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-16 px-4 bg-white/10 backdrop-blur-sm rounded-xl">
      <img src="../assets/no-result.svg" alt="No favorites" class="w-40 h-40 mb-6 animate-bounce-slow" />
      <h3 class="text-xl font-bold text-white mb-2">No Favorites Yet</h3>
      <p class="text-white/80 text-center mb-6">You haven't added any Pokémon to your favorites yet.</p>
      <button
        @click.prevent.stop="goToAllPokemon"
        class="inline-block px-6 py-2 bg-white text-primary-700 font-medium rounded-full shadow-md hover:bg-gray-100 transition-colors text-center"
      >
        Browse Pokémon
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import PokemonCard from './PokemonCard.vue'
import PokemonSkeleton from './PokemonSkeleton.vue'

// Define emits
const emit = defineEmits(['select-pokemon', 'change-tab'])

// Get store
const pokemonStore = usePokemonStore()
const {
  favorites,
  toggleFavorite,
  loadFavorites,
  isLoading
} = pokemonStore

// Methods
const selectPokemon = (pokemon) => {
  emit('select-pokemon', pokemon)
}

const viewDetails = (pokemon) => {
  emit('select-pokemon', pokemon)
}

const handleToggleFavorite = (pokemon) => {
  console.log('Toggling favorite status for:', pokemon.name)

  // Panggil fungsi toggleFavorite di store untuk update status
  toggleFavorite(pokemon)

  // Re-load daftar favorit untuk memastikan UI terupdate
  // Gunakan timeout untuk memastikan perubahan state sudah selesai
  setTimeout(() => {
    loadFavorites()
    console.log('Favorites updated, current count:', favorites.length)
  }, 100)
}

const goToAllPokemon = () => {
  console.log('Navigating to All Pokemon from Favorites')
  try {
    // Use a direct approach to change the tab
    const event = new CustomEvent('change-pokemon-tab', { detail: 'listPokemon' })
    document.dispatchEvent(event)

    // Also emit the event for backward compatibility
    emit('change-tab', 'listPokemon')
  } catch (error) {
    console.error('Error navigating to All Pokemon:', error)
  }
}

// This function is now handled by the PokemonCard component

// Load favorites on mount
onMounted(() => {
  try {
    // Load favorites - loading state is managed in the store
    loadFavorites()
    console.log('Favorites loading initiated')
  } catch (error) {
    console.error('Error in PokemonFavorite onMounted:', error)
  }
})
</script>

<style scoped>
/* Pokemon type colors */
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

/* Card hover effect */
.pokemon-card {
  transition: all 0.3s ease;
}

.pokemon-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>

