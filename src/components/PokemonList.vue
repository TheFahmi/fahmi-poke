<template>
  <!-- Show skeleton loading when store is loading -->
  <div v-if="pokemonStore.isLoading" class="mt-8">
    <!-- Skeleton Loading -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto">
      <PokemonSkeleton v-for="n in 10" :key="`loading-skeleton-${n}`" />
    </div>
  </div>

  <!-- Show Pokemon list when not loading and we have data -->
  <div v-else-if="localPokemons && localPokemons.length > 0">
    <div class="bg-white/20 backdrop-blur-md p-4 rounded-lg mb-4 text-xs overflow-auto">
      <p>Debug: Menampilkan {{ localPokemons.length }} pokemon</p>
      <pre v-if="localPokemons[0]">First Pokemon: {{ JSON.stringify(localPokemons[0], null, 2).substring(0, 200) + '...' }}</pre>
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto">
      <PokemonCard
        v-for="(pokemon, index) in localPokemons"
        :key="pokemon.id || index"
        :pokemon="pokemon"
        @select-pokemon="selectPokemon"
        @view-details="viewDetails"
        @toggle-favorite="handleToggleFavorite"
      />
    </div>

    <!-- Loading Skeletons for Next Batch -->
    <div v-if="pokemonStore.isLoading" class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto mt-6">
      <PokemonSkeleton v-for="n in 5" :key="`next-skeleton-${n}`" />
    </div>
  </div>
  <div v-else class="text-center py-16 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg mt-8">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-white/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="text-xl font-bold text-white mb-2">No Pokemon Data Available</h3>
    <p class="text-white/70 max-w-md mx-auto mb-6">Try refreshing the page or check your connection.</p>
    <pre class="bg-white/20 backdrop-blur-md p-4 rounded-lg mb-4 mx-auto max-w-lg text-xs overflow-auto text-white">
      Debug:
      Props: {{ props.pokemons ? JSON.stringify(props.pokemons.length) : 'undefined' }}
      Local: {{ localPokemons ? localPokemons.length : 0 }}
    </pre>
    <button
      @click="retryLoading"
      class="bg-white hover:bg-gray-100 text-primary-700 font-medium py-2 px-6 rounded-full shadow-md transition-all duration-200"
    >
      Retry Loading
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import PokemonCard from './PokemonCard.vue'
import PokemonSkeleton from './PokemonSkeleton.vue'

// Define props and emits
const props = defineProps({
  pokemons: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-pokemon'])

// Local state
const localPokemons = ref([])

// Get store
const pokemonStore = usePokemonStore()
const { toggleFavorite, IMAGE_URL, fetchPokemons, fetchPokemonTypes } = pokemonStore

// Watch for changes in props.pokemons
watch(() => props.pokemons, (newPokemons) => {
  console.log('PokemonList received new data:', newPokemons?.length || 0, 'pokemon')
  // Only update localPokemons if we're not currently loading
  if (!pokemonStore.isLoading && newPokemons && Array.isArray(newPokemons)) {
    localPokemons.value = [...newPokemons]
    console.log('PokemonList localPokemons updated:', localPokemons.value.length, 'items')
    console.log('First pokemon:', localPokemons.value[0])
  }
}, { immediate: true, deep: true })

// Also watch for loading state changes
watch(() => pokemonStore.isLoading, (isLoading) => {
  console.log('Loading state changed:', isLoading)
  // When loading finishes, update localPokemons with the latest data
  if (!isLoading && pokemonStore.pokemons && pokemonStore.pokemons.length > 0) {
    localPokemons.value = [...pokemonStore.pokemons]
    console.log('Updated localPokemons after loading finished:', localPokemons.value.length, 'items')
  }
})

// Methods
const getPokemonImage = (pokemon) => {
  // Check if pokemon exists
  if (!pokemon) return `${IMAGE_URL}0.png`

  // Try to get official artwork first
  if (pokemon.sprites?.other?.['official-artwork']?.front_default) {
    return pokemon.sprites.other['official-artwork'].front_default
  }

  // Fall back to regular sprite
  if (pokemon.sprites?.front_default) {
    return pokemon.sprites.front_default
  }

  // Last resort, use the ID to construct URL
  return `${IMAGE_URL}${pokemon.id || '0'}.png`
}

// Get the primary type of a Pokemon for styling
const getPrimaryType = (pokemon) => {
  if (!pokemon?.types?.length) return 'normal'
  return pokemon.types[0].type?.name || 'normal'
}

// Methods to interact with Pokemon
const selectPokemon = (pokemon) => {
  if (pokemon) {
    emit('select-pokemon', pokemon)
  }
}

const viewDetails = (pokemon) => {
  if (pokemon) {
    emit('select-pokemon', pokemon)
  }
}

const handleToggleFavorite = (pokemon) => {
  // The toggle is already handled in the PokemonCard component
  // This is just to handle any additional logic if needed
  console.log('Toggled favorite status for:', pokemon.name)
}

// Manually load data if props is empty
const loadDataDirectly = () => {
  console.log('Loading data directly from store in PokemonList')

  // Don't try to load data if we're already loading
  if (pokemonStore.isLoading) {
    console.log('Already loading data, not triggering another load')
    return
  }

  // First check if we already have data in our local state
  if (localPokemons.value && localPokemons.value.length > 0) {
    console.log('Already have local data, not loading')
    return
  }

  // Try to get data directly from store
  const storeData = pokemonStore.pokemons
  console.log('Direct store access - pokemons:', storeData ? storeData.length : 0)

  if (storeData && Array.isArray(storeData) && storeData.length > 0) {
    console.log('Got data directly from store:', storeData.length, 'items')
    localPokemons.value = [...storeData]
  } else {
    console.log('No data in store or empty array, fetching directly')
    // Set loading state and fetch new data
    pokemonStore.isLoading = true
    fetchPokemons()

    // We don't need to manually update localPokemons here
    // The watcher for pokemonStore.isLoading will handle that
    // when loading finishes
  }
}

// Add retryLoading function
const retryLoading = () => {
  // Clear local data
  localPokemons.value = []

  // Set loading state
  pokemonStore.isLoading = true

  // Fetch data
  fetchPokemons()
  fetchPokemonTypes()

  // No need to manually call loadDataDirectly
  // The watcher for pokemonStore.isLoading will handle updating localPokemons
  // when loading finishes
}

onMounted(() => {
  console.log('PokemonList mounted, props:', props)
  console.log('PokemonList mounted, receiving props.pokemons:', props.pokemons?.length || 0)

  // If we're already loading, don't try to set data
  if (pokemonStore.isLoading) {
    console.log('Store is already loading, waiting for data...')
    return
  }

  if (props.pokemons && Array.isArray(props.pokemons) && props.pokemons.length > 0) {
    console.log('Setting localPokemons from props')
    localPokemons.value = [...props.pokemons]
    console.log('Initial localPokemons set to:', localPokemons.value.length, 'items')
  } else {
    console.warn('No pokemons received in props on mount, loading directly from store')
    // Try to load data directly from store
    loadDataDirectly()
  }

  // Always setup watcher even if we loaded directly
  setTimeout(() => {
    // Check if we still don't have data and we're not loading
    if (!pokemonStore.isLoading && (!localPokemons.value || !localPokemons.value.length)) {
      console.warn('No data after 3 seconds and not loading, forcing data load')
      loadDataDirectly()
    }
  }, 3000)
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
.type-unknown { background-color: #68A090; }

/* Type background colors (lighter versions) */
.bg-normal-light { background-color: #C6C6A7; }
.bg-fire-light { background-color: #F5AC78; }
.bg-water-light { background-color: #9DB7F5; }
.bg-grass-light { background-color: #A7DB8D; }
.bg-electric-light { background-color: #FAE078; }
.bg-ice-light { background-color: #BCE6E6; }
.bg-fighting-light { background-color: #D67873; }
.bg-poison-light { background-color: #C183C1; }
.bg-ground-light { background-color: #EBD69D; }
.bg-flying-light { background-color: #C6B7F5; }
.bg-psychic-light { background-color: #FA92B2; }
.bg-bug-light { background-color: #C6D16E; }
.bg-rock-light { background-color: #D1C17D; }
.bg-ghost-light { background-color: #A292BC; }
.bg-dragon-light { background-color: #A27DFA; }
.bg-dark-light { background-color: #A29288; }
.bg-steel-light { background-color: #D1D1E0; }
.bg-fairy-light { background-color: #F4BDC9; }
.bg-unknown-light { background-color: #9DC1B7; }

/* Card hover effect */
.pokemon-card {
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pokemon-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

/* Add a subtle pulse animation to the Pokémon image on hover */
.pokemon-card:hover img {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
</style>

