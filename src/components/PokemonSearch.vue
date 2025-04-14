<template>
  <div class="relative w-full">
    <form @submit.prevent="handleSearch">
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search Pokémon by name or ID..."
          v-model="searchValue"
          @input="handleInput"
          @focus="showSuggestions = true"
          @blur="hideSuggestionsDelayed"
          class="w-full py-3 pl-10 pr-10 rounded-lg border-0 bg-white/90 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-primary-500 focus:outline-none focus:bg-white transition-all duration-200"
        >
        <button
          v-if="searchValue"
          type="button"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </form>

    <!-- Suggestions Dropdown -->
    <div
      v-if="showSuggestions && searchValue && (filteredSuggestions.length > 0 || isLoadingSuggestions)"
      class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700"
    >
      <!-- Loading Indicator -->
      <div v-if="isLoadingSuggestions && filteredSuggestions.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
        <div class="flex justify-center items-center">
          <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Pokémon...
        </div>
      </div>

      <!-- No Results Message -->
      <div v-else-if="filteredSuggestions.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
        No Pokémon found matching "{{ searchValue }}"
      </div>

      <!-- Suggestions List -->
      <ul v-else>
        <li
          v-for="suggestion in filteredSuggestions"
          :key="suggestion.id"
          @mousedown="selectSuggestion(suggestion)"
          class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 transition-colors duration-150 dark:text-white"
        >
          <img
            :src="suggestion.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${suggestion.id}.png`"
            :alt="suggestion.name"
            class="w-8 h-8 object-contain"
          />
          <div>
            <span class="font-medium capitalize">{{ suggestion.name }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">#{{ suggestion.id }}</span>
          </div>
        </li>
      </ul>

      <!-- Loading More Indicator -->
      <div v-if="isLoadingSuggestions && filteredSuggestions.length > 0" class="p-2 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        Loading more Pokémon...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'

// Define emits
const emit = defineEmits(['search'])

// Get store
const pokemonStore = usePokemonStore()

// State
const searchValue = ref('')
const showSuggestions = ref(false)
const suggestions = ref([])
const blurTimeout = ref(null)
const isLoadingSuggestions = ref(false)

// Computed
const filteredSuggestions = computed(() => {
  if (!searchValue.value) return []

  const query = searchValue.value.toLowerCase()
  return suggestions.value
    .filter(pokemon => pokemon.name.toLowerCase().includes(query))
    .slice(0, 5) // Limit to 5 suggestions
})

// Methods
const handleSearch = () => {
  if (searchValue.value.trim()) {
    emit('search', searchValue.value.trim().toLowerCase())
    showSuggestions.value = false
  }
}

const handleInput = async () => {
  showSuggestions.value = true
  updateSuggestions()

  // If we have few suggestions and there are more Pokemon to load, load them
  if (filteredSuggestions.value.length < 3 && pokemonStore.pokemons.length < 150 && pokemonStore.nextUrl) {
    await loadMorePokemonForSuggestions()
  }
}

const updateSuggestions = () => {
  // Get suggestions from the store's pokemon list
  if (pokemonStore.pokemons && pokemonStore.pokemons.length > 0) {
    suggestions.value = [...pokemonStore.pokemons]
  }
}

const selectSuggestion = (suggestion) => {
  searchValue.value = suggestion.name
  emit('search', suggestion.name.toLowerCase())
  showSuggestions.value = false
}

const clearSearch = () => {
  searchValue.value = ''
  showSuggestions.value = false
  // Focus the input after clearing
  setTimeout(() => {
    document.querySelector('input').focus()
  }, 0)
}

const hideSuggestionsDelayed = () => {
  // Use timeout to allow click events on suggestions to fire before hiding
  blurTimeout.value = setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// Watch for changes in the Pokemon store
watch(() => pokemonStore.pokemons, (newPokemons) => {
  if (newPokemons && newPokemons.length > 0) {
    suggestions.value = [...newPokemons]
  }
})

// Function to load more Pokemon for better suggestions
const loadMorePokemonForSuggestions = async () => {
  // Load more Pokemon if we have less than 150 for better suggestions
  if (pokemonStore.pokemons.length < 150 && pokemonStore.nextUrl) {
    try {
      isLoadingSuggestions.value = true

      // Load at least 3 pages of Pokemon
      for (let i = 0; i < 3; i++) {
        if (pokemonStore.nextUrl) {
          await pokemonStore.fetchPokemons()
          // Short delay to prevent API rate limiting
          await new Promise(resolve => setTimeout(resolve, 300))
        } else {
          break
        }
      }

      console.log(`Loaded ${pokemonStore.pokemons.length} Pokemon for suggestions`)
    } catch (error) {
      console.error('Error loading Pokemon for suggestions:', error)
    } finally {
      isLoadingSuggestions.value = false
    }
  }
}

onMounted(async () => {
  // Initialize suggestions from store
  updateSuggestions()

  // Load more Pokemon for better suggestions
  await loadMorePokemonForSuggestions()
})
</script>

<style scoped>
/* Add smooth animation for suggestions dropdown */
.absolute {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}
</style>