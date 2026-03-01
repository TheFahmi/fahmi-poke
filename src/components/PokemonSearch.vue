<template>
  <div class="relative w-full" ref="searchContainerRef">
    <form @submit.prevent="handleSearch">
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-focus-within:text-accent transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
          </svg>
        </div>
        
        <input
          type="text"
          placeholder="Search Pokémon..."
          v-model="searchValue"
          @input="handleInput"
          @focus="showSuggestions = true"
          @keydown.escape="showSuggestions = false"
          @keydown.down.prevent="navigateSuggestions(1)"
          @keydown.up.prevent="navigateSuggestions(-1)"
          @keydown.enter.prevent="selectHighlightedOrSearch"
          class="w-full bg-white dark:bg-primary-800 border border-gray-200 dark:border-gray-600/50 rounded-lg pl-11 pr-10 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 shadow-sm dark:shadow-none"
          ref="searchInputRef"
        >
        
        <button
          v-if="searchValue"
          type="button"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </form>

    <transition name="dropdown">
      <div
        v-if="showSuggestions && searchValue && (filteredSuggestions.length > 0 || isLoadingSuggestions)"
        class="absolute z-50 w-full mt-1 bg-white dark:bg-primary-800 border border-gray-200 dark:border-gray-600/30 rounded-lg shadow-lg overflow-hidden"
      >
        <!-- Loading State -->
        <div v-if="isLoadingSuggestions && filteredSuggestions.length === 0" class="px-4 py-3 text-sm text-gray-400 flex items-center justify-center">
          <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Searching...
        </div>

        <!-- No Results -->
        <div v-else-if="filteredSuggestions.length === 0" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
          No Pokémon found matching "{{ searchValue }}"
        </div>

        <!-- Suggestions List -->
        <ul v-else class="max-h-60 overflow-y-auto py-1">
          <li
            v-for="(suggestion, index) in filteredSuggestions"
            :key="suggestion.id"
            @mousedown="selectSuggestion(suggestion)"
            @mouseenter="highlightedIndex = index"
            class="px-4 py-2 cursor-pointer flex items-center gap-3 transition-colors duration-150 text-gray-700 dark:text-gray-200"
            :class="[
              highlightedIndex === index ? 'bg-gray-100 dark:bg-primary-700' : 'hover:bg-gray-50 dark:hover:bg-primary-700'
            ]"
          >
            <img
              :src="suggestion.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${suggestion.id}.png`"
              :alt="suggestion.name"
              class="w-8 h-8 object-contain"
            />
            <div class="flex flex-col">
              <span class="font-medium capitalize text-sm">{{ suggestion.name }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">#{{ String(suggestion.id).padStart(3, '0') }}</span>
            </div>
          </li>
        </ul>

        <!-- Load More Indicator -->
        <div v-if="isLoadingSuggestions && filteredSuggestions.length > 0" class="px-4 py-2 text-xs text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600/30 bg-gray-50 dark:bg-primary-800/50">
          Loading more...
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'

const emit = defineEmits(['search'])
const pokemonStore = usePokemonStore()

// State
const searchValue = ref('')
const showSuggestions = ref(false)
const suggestions = ref([])
const isLoadingSuggestions = ref(false)
const searchInputRef = ref(null)
const searchContainerRef = ref(null)
const highlightedIndex = ref(-1)
let searchTimeout = null

// Computed
const filteredSuggestions = computed(() => {
  if (!searchValue.value) return []
  const query = searchValue.value.toLowerCase()
  return suggestions.value
    .filter(pokemon => pokemon.name.toLowerCase().includes(query))
    .slice(0, 5)
})

// Click outside handling
const handleClickOutside = (event) => {
  if (searchContainerRef.value && !searchContainerRef.value.contains(event.target)) {
    showSuggestions.value = false
  }
}

// Methods
const handleSearch = () => {
  if (searchValue.value.trim()) {
    emit('search', searchValue.value.trim())
    showSuggestions.value = false
    searchInputRef.value?.blur()
  }
}

const handleInput = () => {
  showSuggestions.value = true
  highlightedIndex.value = -1
  
  // Debounce API calls for loading more suggestions
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    if (searchValue.value.trim().length >= 2 && filteredSuggestions.value.length < 5 && pokemonStore.nextUrl) {
      await loadMorePokemonForSuggestions()
    }
  }, 300)
}

const selectSuggestion = (suggestion) => {
  searchValue.value = suggestion.name
  emit('search', suggestion.name)
  showSuggestions.value = false
}

const clearSearch = () => {
  searchValue.value = ''
  showSuggestions.value = false
  highlightedIndex.value = -1
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

// Keyboard navigation
const navigateSuggestions = (direction) => {
  if (!showSuggestions.value || filteredSuggestions.value.length === 0) return
  
  const maxIndex = filteredSuggestions.value.length - 1
  highlightedIndex.value += direction
  
  if (highlightedIndex.value > maxIndex) highlightedIndex.value = 0
  else if (highlightedIndex.value < 0) highlightedIndex.value = maxIndex
}

const selectHighlightedOrSearch = () => {
  if (showSuggestions.value && highlightedIndex.value >= 0 && filteredSuggestions.value[highlightedIndex.value]) {
    selectSuggestion(filteredSuggestions.value[highlightedIndex.value])
  } else {
    handleSearch()
  }
}

const updateSuggestions = () => {
  if (pokemonStore.pokemons?.length > 0) {
    suggestions.value = [...pokemonStore.pokemons]
  }
}

const loadMorePokemonForSuggestions = async () => {
  if (pokemonStore.pokemons.length < 150 && pokemonStore.nextUrl) {
    try {
      isLoadingSuggestions.value = true
      for (let i = 0; i < 3 && pokemonStore.nextUrl; i++) {
        await pokemonStore.fetchPokemons()
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } catch (error) {
      console.error('Error loading suggestions:', error)
    } finally {
      isLoadingSuggestions.value = false
    }
  }
}

// Lifecycle & Watchers
watch(() => pokemonStore.pokemons, (newPokemons) => {
  if (newPokemons?.length > 0) {
    suggestions.value = [...newPokemons]
  }
})

watch(searchValue, () => {
  highlightedIndex.value = -1
})

onMounted(async () => {
  updateSuggestions()
  document.addEventListener('mousedown', handleClickOutside)
  
  if (pokemonStore.pokemons.length < 20 && pokemonStore.nextUrl) {
    await loadMorePokemonForSuggestions()
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  clearTimeout(searchTimeout)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scaleY(0.95);
}

/* Custom scrollbar for suggestions */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
