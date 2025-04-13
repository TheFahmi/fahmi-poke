<template>
  <div class="min-h-screen bg-gradient-to-br from-pokemon-yellow via-pokemon-red to-pokemon-blue dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-500">
    <!-- Header with Glass Morphism -->
    <header class="sticky top-0 z-40 backdrop-blur-md bg-white/10 dark:bg-black/30 shadow-lg py-4 mb-8">
      <div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <!-- Logo and Title -->
        <div class="flex items-center mb-4 md:mb-0">
          <img
            alt="Pokémon logo"
            src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"
            class="h-10 md:h-12 mr-4"
          >
          <h1 class="text-2xl md:text-3xl font-bold text-white drop-shadow-md">Pokédex</h1>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <DarkModeToggle class="mr-2" />

          <!-- Navigation Tabs -->
          <div class="flex space-x-2 bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm p-1 rounded-full shadow-inner">
            <button
              @click.prevent.stop="switchToAllPokemon"
              :class="{
                'bg-white text-primary-700 dark:bg-gray-800 dark:text-white shadow-md' : activeMenu === 'listPokemon',
                'text-white hover:bg-white/40 dark:hover:bg-gray-700/40' : activeMenu !== 'listPokemon'
              }"
              class="px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
              type="button"
            >
              All Pokémon
            </button>
            <button
              @click.prevent.stop="switchToFavorites"
              :class="{
                'bg-white text-primary-700 dark:bg-gray-800 dark:text-white shadow-md' : activeMenu === 'listFavorite',
                'text-white hover:bg-white/40 dark:hover:bg-gray-700/40' : activeMenu !== 'listFavorite'
              }"
              class="px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
              type="button"
            >
              Favorites
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 pb-12">
      <!-- Search and Filter Section -->
      <div v-if="activeMenu === 'listPokemon'" class="max-w-4xl mx-auto mb-8 relative z-30">
        <div class="bg-white/20 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          <div class="flex flex-col md:flex-row gap-4 items-center">
            <!-- Search Component -->
            <div class="w-full md:w-2/3">
              <PokemonSearch @search="handleSearch" />
            </div>

            <!-- Type Filter Dropdown -->
            <div class="w-full md:w-1/3 relative type-dropdown z-40">
              <div class="relative">
                <button
                  @click.stop="isTypeDropdownOpen = !isTypeDropdownOpen"
                  class="w-full bg-white/90 backdrop-blur-sm text-gray-700 py-2 px-4 rounded-lg shadow-md flex items-center justify-between hover:bg-white transition-colors duration-200 relative"
                  type="button"
                >
                  <span class="capitalize font-medium">{{ selectedType.value || 'Filter by Type' }}</span>
                  <svg
                    class="w-5 h-5 ml-2 -mr-1 transition-transform duration-200"
                    :class="{ 'rotate-180': isTypeDropdownOpen }"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>

                <!-- Reset Filter Button (only visible when a filter is active) -->
                <button
                  v-if="selectedType.value"
                  @click="clearTypeFilter"
                  class="absolute right-0 -top-8 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-red-600 transition-colors"
                >
                  Reset Filter
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="isTypeDropdownOpen"
                  class="absolute right-0 z-50 mt-2 w-full rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none max-h-80 overflow-y-auto"
                  @click.stop
                >
                  <div class="py-2 px-1">
                    <button
                      @click="clearTypeFilter"
                      class="w-full text-left px-4 py-2 text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors duration-150 flex items-center justify-between"
                    >
                      <span>All Types</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div class="mt-2 border-t border-gray-200 pt-2">
                      <div v-if="pokemonStore.pokemonTypes && pokemonStore.pokemonTypes.length > 0" class="grid grid-cols-2 gap-1 mt-1">
                        <button
                          v-for="type in pokemonStore.pokemonTypes"
                          :key="type.name"
                          @click="filterByType(type.name)"
                          :class="`type-${type.name} bg-opacity-20 hover:bg-opacity-30`"
                          class="text-left px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors duration-150 flex items-center"
                        >
                          <span class="w-3 h-3 rounded-full mr-2" :class="`type-${type.name}`"></span>
                          {{ type.name }}
                        </button>
                      </div>
                      <div v-else class="text-center py-2 text-gray-500">
                        Loading types...
                        <button @click="handleTypeRetry" class="ml-2 text-blue-500 hover:underline">
                          Retry
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading.value" class="py-12 flex justify-center">
        <Loading />
      </div>

      <!-- Main content -->
      <div class="mt-8">
        <!-- Pokemon list section -->
        <section v-if="activeMenu === 'listPokemon'" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <!-- Display Pokemon Card - Redesigned -->
          <div
            v-for="pokemon in directPokemonList"
            :key="pokemon.id"
            class="group relative bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2"
          >
            <!-- Card Header with Pokémon ID -->
            <div class="absolute top-3 left-3 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold text-white">
              #{{ pokemon.id.padStart(3, '0') }}
            </div>

            <!-- Favorite Button -->
            <button
              @click.stop="togglePokemonFavorite(pokemon)"
              class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-white/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                :fill="pokemon.isLike ? 'red' : 'none'"
                stroke="currentColor"
                class="w-5 h-5"
                :class="pokemon.isLike ? 'text-red-500' : 'text-white'"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            <!-- Pokemon Image Container -->
            <div class="relative h-48 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white/5 to-white/20">
              <!-- Pokemon Image -->
              <img
                v-if="pokemon.sprites && pokemon.sprites.other && pokemon.sprites.other['official-artwork'] && pokemon.sprites.other['official-artwork'].front_default"
                :src="pokemon.sprites.other['official-artwork'].front_default"
                :alt="pokemon.name"
                class="h-40 w-40 object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-lg"
                loading="lazy"
              />
              <img
                v-else-if="pokemon.sprites && pokemon.sprites.front_default"
                :src="pokemon.sprites.front_default"
                :alt="pokemon.name"
                class="h-40 w-40 object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-lg"
                loading="lazy"
              />
              <div
                v-else
                class="h-40 w-40 flex items-center justify-center"
              >
                <div class="text-white/50">Loading...</div>
              </div>

              <!-- Type Badges on Image -->
              <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                <span
                  v-for="type in pokemon.types"
                  :key="type.type.name"
                  :class="`type-${type.type.name}`"
                  class="px-3 py-1 rounded-full text-xs font-bold shadow-md capitalize"
                >
                  {{ type.type.name }}
                </span>
              </div>
            </div>

            <!-- Pokemon Info -->
            <div class="p-4">
              <h3 class="text-xl font-bold text-white capitalize text-center mb-2">
                {{ pokemon.name }}
              </h3>

              <!-- Pokemon Stats Preview (optional) -->
              <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-white/80">
                <div class="flex flex-col items-center bg-white/10 rounded-lg p-2">
                  <span class="text-white/60">Height</span>
                  <span class="font-bold text-white">{{ pokemon.height ? `${(pokemon.height/10).toFixed(1)}m` : 'N/A' }}</span>
                </div>
                <div class="flex flex-col items-center bg-white/10 rounded-lg p-2">
                  <span class="text-white/60">Weight</span>
                  <span class="font-bold text-white">{{ pokemon.weight ? `${(pokemon.weight/10).toFixed(1)}kg` : 'N/A' }}</span>
                </div>
              </div>

              <!-- View Details Button -->
              <button
                @click="showPokemonDetails(pokemon)"
                class="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors duration-300"
              >
                View Details
              </button>
            </div>
          </div>

          <!-- Loading state or empty message -->
          <p v-if="isLoading.value" class="col-span-full text-center text-white">Loading...</p>
          <p v-else-if="directPokemonList.length === 0" class="col-span-full text-center text-white">No Pokemon available</p>
        </section>

        <!-- Loading Skeletons for Infinite Scroll -->
        <div v-if="activeMenu === 'listPokemon' && nextUrl.value && isLoading.value && !directPokemonList.length" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6">
          <PokemonSkeleton v-for="n in 5" :key="`infinite-skeleton-${n}`" />
        </div>

        <!-- Infinite Scroll Trigger Element -->
        <div ref="infiniteScrollTrigger" class="py-4 mt-2" v-if="activeMenu === 'listPokemon' && nextUrl.value">
          <div v-if="isLoading.value" class="flex justify-center items-center py-2">
            <div class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2 shadow-md">
              <span class="text-white text-sm">Memuat Pokémon</span>
              <div class="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
              <div class="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
          <div v-else class="text-center">
            <span class="text-white/60 text-xs bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              Scroll untuk melihat lebih banyak Pokémon
            </span>
          </div>
        </div>

        <!-- Fallback Infinite Scroll Trigger -->
        <div ref="infiniteScrollTriggerFallback" class="h-1 mt-2"></div>

        <!-- Display Favorites List-->
        <PokemonFavorite
          v-if="activeMenu === 'listFavorite'"
          @select-pokemon="showPokemonDetails"
          @change-tab="handleTabChange"
        />

        <!-- Pokemon Detail Modal -->
        <PokemonDetail
          v-if="selectedPokemon"
          :pokemon="selectedPokemon"
          @close="selectedPokemon = null"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import PokemonSearch from '@/components/PokemonSearch.vue'
import PokemonList from '@/components/PokemonList.vue'
import PokemonFavorite from '@/components/PokemonFavorite.vue'
import PokemonDetail from '@/components/PokemonDetail.vue'
import PokemonSkeleton from '@/components/PokemonSkeleton.vue'
import Loading from '@/components/Loading.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

// Initialize store
const pokemonStore = usePokemonStore()

// Refs ke state store
const pokemons = computed(() => pokemonStore.pokemons)
const filteredPokemons = computed(() => pokemonStore.filteredPokemons)
const pokemonTypes = computed(() => pokemonStore.pokemonTypes)
const isLoading = computed(() => pokemonStore.isLoading)
const selectedType = computed(() => pokemonStore.selectedType)
const nextUrl = computed(() => pokemonStore.nextUrl)
const error = computed(() => pokemonStore.error)

// Ambil fungsi-fungsi dari store
const {
  fetchPokemons,
  fetchPokemonTypes,
  fetchPokemonByType,
  searchPokemon,
  resetFilters,
  loadFavorites,
  loadFallbackData,
  init,
  toggleFavorite
} = pokemonStore

// Local state
const activeMenu = ref('listPokemon')
const selectedPokemon = ref(null)
const isTypeDropdownOpen = ref(false)
const infiniteScrollTrigger = ref(null)
const infiniteScrollTriggerFallback = ref(null)
const observer = ref(null)

// Add direct access to store data
const directPokemonList = computed(() => {
  // Try multiple sources in order of preference
  if (pokemonStore.filteredPokemons?.length > 0) {
    return pokemonStore.filteredPokemons
  }

  if (pokemonStore.pokemons?.length > 0) {
    return pokemonStore.pokemons
  }

  if (window.pokemonStore?.pokemons?.length > 0) {
    return window.pokemonStore.pokemons
  }

  return []
})

// Methods
const handleSearch = async (query) => {
  try {
    const pokemon = await searchPokemon(query)
    if (pokemon) {
      showPokemonDetails(pokemon)
    }
  } catch (error) {
    console.error('Error searching for Pokémon:', error)
  }
}

const showPokemonDetails = (pokemon) => {
  selectedPokemon.value = pokemon
}

const fetchPokemonsData = () => {
  try {
    pokemonStore.selectedType = ''
    pokemonStore.pokemons = []
    pokemonStore.nextUrl = ''
    fetchPokemons()
    fetchPokemonTypes()
  } catch (error) {
    console.error('Error saat memuat ulang data:', error)
    loadFallbackData()
  }
}

const filterByType = (type) => {
  try {
    if (!type) return
    pokemonStore.fetchPokemonByType(type)
    isTypeDropdownOpen.value = false
  } catch (error) {
    console.error('Error filtering by type:', error)
  }
}

const clearTypeFilter = () => {
  try {
    pokemonStore.resetFilters()
    isTypeDropdownOpen.value = false
  } catch (error) {
    console.error('Error clearing type filter:', error)
  }
}

const loadMorePokemon = () => {
  try {
    pokemonStore.fetchPokemons()
  } catch (error) {
    console.error('Error loading more Pokémon:', error)
  }
}

// Navigation methods
const switchToAllPokemon = () => {
  activeMenu.value = 'listPokemon'

  if (!pokemons.value || pokemons.value.length === 0) {
    fetchPokemons()
  }

  if (!pokemonTypes.value || pokemonTypes.value.length === 0) {
    fetchPokemonTypes()
  }
}

const switchToFavorites = () => {
  activeMenu.value = 'listFavorite'
  loadFavorites()
}

// Handle tab change from child components
const handleTabChange = (tab) => {
  try {
    if (tab === 'listPokemon') {
      switchToAllPokemon()
    } else if (tab === 'listFavorite') {
      switchToFavorites()
    }
  } catch (error) {
    console.error('Error changing tabs:', error)
    activeMenu.value = tab
  }
}

// Handle direct tab change from custom event
const handleDirectTabChange = (event) => {
  try {
    activeMenu.value = event.detail

    if (event.detail === 'listPokemon') {
      if (!pokemons.value || pokemons.value.length === 0) {
        pokemonStore.fetchPokemons()
      }
      if (!pokemonTypes.value || pokemonTypes.value.length === 0) {
        pokemonStore.fetchPokemonTypes()
      }
    } else if (event.detail === 'listFavorite') {
      pokemonStore.loadFavorites()
    }
  } catch (error) {
    console.error('Error handling tab change:', error)
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (isTypeDropdownOpen.value && !event.target.closest('.type-dropdown')) {
    isTypeDropdownOpen.value = false
  }
}

// Handler untuk tombol favorite
const togglePokemonFavorite = (pokemon) => {
  try {
    if (typeof pokemonStore.toggleFavorite === 'function') {
      pokemonStore.toggleFavorite(pokemon)
    } else {
      pokemon.isLike = !pokemon.isLike

      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')

      if (pokemon.isLike) {
        if (!favorites.includes(pokemon.id)) {
          favorites.push(pokemon.id)
        }
      } else {
        const index = favorites.indexOf(pokemon.id)
        if (index !== -1) {
          favorites.splice(index, 1)
        }
      }

      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

// Set up infinite scroll observer
const setupInfiniteScroll = () => {
  try {
    // Disconnect previous observer if it exists
    if (observer.value) {
      observer.value.disconnect()
    }

    // Wait briefly to ensure DOM is updated
    setTimeout(() => {
      // Create a new IntersectionObserver
      observer.value = new IntersectionObserver((entries) => {
        // If the trigger element is visible and we're not already loading
        if (entries[0].isIntersecting && !isLoading.value && nextUrl.value) {
          console.log('Trigger observed, loading more Pokemon...')
          loadMorePokemon()
        }
      }, {
        root: null, // Use the viewport as the root
        rootMargin: '0px 0px 400px 0px', // Start loading when within 400px of the bottom
        threshold: 0.1 // Trigger when 10% of the element is visible
      })

      // Start observing the primary trigger element if it exists
      if (infiniteScrollTrigger.value) {
        observer.value.observe(infiniteScrollTrigger.value)
        console.log('Observing primary infinite scroll trigger')
      } else if (infiniteScrollTriggerFallback.value) {
        // Use fallback element if primary doesn't exist
        observer.value.observe(infiniteScrollTriggerFallback.value)
        console.log('Observing fallback infinite scroll trigger')
      } else {
        // Try again after a longer delay as a fallback
        console.log('No scroll triggers found, retrying setup in 1s')
        setTimeout(setupInfiniteScroll, 1000)
      }
    }, 100)
  } catch (error) {
    console.error('Error setting up infinite scroll:', error)
  }
}

// Pastikan tipe Pokemon selalu tersedia
const ensureTypesLoaded = () => {
  try {
    if (!pokemonTypes.value || pokemonTypes.value.length === 0) {
      console.log('Types not loaded, fetching...')
      fetchPokemonTypes()

      // Langsung ambil dari window store jika tersedia
      if (window.pokemonStore?.pokemonTypes && window.pokemonStore.pokemonTypes.length > 0) {
        console.log('Using types from global store')
        pokemonStore.$patch({
          pokemonTypes: [...window.pokemonStore.pokemonTypes]
        })
      }
    }
  } catch (error) {
    console.error('Error ensuring types are loaded:', error)
  }
}

onMounted(() => {
  // Ensure types are loaded immediately
  ensureTypesLoaded()

  // Ensure store is initialized
  if (!pokemons.value || pokemons.value.length === 0) {
    if (window.pokemonStore && window.pokemonStore.pokemons && window.pokemonStore.pokemons.length > 0) {
      // Use global store data directly
      pokemonStore.$patch({
        pokemons: [...window.pokemonStore.pokemons],
        pokemonTypes: [...window.pokemonStore.pokemonTypes || []],
        selectedType: window.pokemonStore.selectedType
      })
    } else {
      // Initialize store normally
      pokemonStore.init()
    }
  }

  // Add click outside listener
  document.addEventListener('click', handleClickOutside)

  // Listen for direct tab change events
  document.addEventListener('change-pokemon-tab', handleDirectTabChange)

  // Handle hash navigation
  window.addEventListener('hashchange', handleHashChange)
  handleHashChange()

  // Set up infinite scroll after a short delay to ensure the DOM is ready
  setTimeout(() => {
    setupInfiniteScroll()
  }, 500)
})

// Handle hash navigation
const handleHashChange = () => {
  const hash = window.location.hash

  if (hash === '#all-pokemon') {
    switchToAllPokemon()
  } else if (hash === '#favorites') {
    switchToFavorites()
  }
}

// Clean up event listeners
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('change-pokemon-tab', handleDirectTabChange)
  window.removeEventListener('hashchange', handleHashChange)

  // Clean up the IntersectionObserver
  if (observer.value) {
    observer.value.disconnect()
    observer.value = null
  }
})

// Watch for active menu changes
watch(activeMenu, (newValue) => {
  if (newValue === 'listPokemon') {
    // Ensure we have data when switching to Pokemon list
    if (!pokemons.value || pokemons.value.length === 0) {
      fetchPokemons()
    }

    if (!pokemonTypes.value || pokemonTypes.value.length === 0) {
      fetchPokemonTypes()
    }

    // Give time for the DOM to update
    setTimeout(() => {
      setupInfiniteScroll()
    }, 300)
  }
})

// Watch for both trigger elements
watch([
  () => infiniteScrollTrigger.value,
  () => infiniteScrollTriggerFallback.value
], ([primary, fallback]) => {
  if ((primary || fallback) && activeMenu.value === 'listPokemon') {
    setupInfiniteScroll()
  }
})

// Update fetchPokemonTypes function call
const handleTypeRetry = () => {
  try {
    fetchPokemonTypes()

    // Juga coba ambil dari store global jika tersedia
    if (window.pokemonStore?.pokemonTypes && window.pokemonStore.pokemonTypes.length > 0) {
      pokemonStore.$patch({
        pokemonTypes: [...window.pokemonStore.pokemonTypes]
      })
    }
  } catch (error) {
    console.error('Error fetching types on retry:', error)
  }
}
</script>

<style scoped>
/* Animations */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Bounce animation for loading dots */
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
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Type colors for filter buttons */
.type-normal { background-color: #A8A878; color: white; }
.type-fire { background-color: #F08030; color: white; }
.type-water { background-color: #6890F0; color: white; }
.type-grass { background-color: #78C850; color: white; }
.type-electric { background-color: #F8D030; color: black; }
.type-ice { background-color: #98D8D8; color: black; }
.type-fighting { background-color: #C03028; color: white; }
.type-poison { background-color: #A040A0; color: white; }
.type-ground { background-color: #E0C068; color: black; }
.type-flying { background-color: #A890F0; color: white; }
.type-psychic { background-color: #F85888; color: white; }
.type-bug { background-color: #A8B820; color: white; }
.type-rock { background-color: #B8A038; color: white; }
.type-ghost { background-color: #705898; color: white; }
.type-dragon { background-color: #7038F8; color: white; }
.type-dark { background-color: #705848; color: white; }
.type-steel { background-color: #B8B8D0; color: black; }
.type-fairy { background-color: #EE99AC; color: black; }
</style>