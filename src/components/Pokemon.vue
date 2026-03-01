<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 font-sans selection:bg-indigo-500/30">
    <!-- Sticky Header -->
    <PokemonHeader 
      :active-menu="activeMenu"
      :is-searching="isSearching"
      @search="handleSearch"
      @filter-by-type="filterByType"
      @clear-type-filter="clearTypeFilter"
      @switch-to-all-pokemon="switchToAllPokemon"
      @switch-to-caught="switchToCaught"
      @switch-to-favorite="switchToFavorite"
    />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 mt-16 md:mt-24">
      
      <!-- Introduction Section (All Pokemon) -->
      <div v-if="activeMenu === 'listPokemon'" class="mb-10 text-center">
        <h2 v-if="pokemonStore.isLoading && !directPokemonList.length" class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 animate-pulse bg-gray-200 dark:bg-gray-800 h-8 max-w-sm mx-auto rounded"></h2>
        <h2 v-else class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Explore the World of Pokémon
        </h2>

        <div v-if="pokemonStore.isLoading && !directPokemonList.length" class="space-y-2 max-w-2xl mx-auto mb-6">
          <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mx-auto animate-pulse"></div>
        </div>
        <p v-else class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed">
          Discover and learn about all your favorite Pokémon from different
          generations. Use the search and filter options to find specific
          Pokémon by name, ID, or type.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3">
          <span v-if="!pokemonStore.isLoading || directPokemonList.length" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
            {{ directPokemonList.length }} Pokémon Available
          </span>
          <span v-else class="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></span>

          <!-- Active filters display -->
          <div v-if="displaySelectedType && (!pokemonStore.isLoading || directPokemonList.length)" class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-medium">
            <span class="capitalize">Type: {{ displaySelectedType }}</span>
            <button @click="clearTypeFilter" class="hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Pokemon Grid — All Pokemon view -->
      <div v-if="activeMenu === 'listPokemon'">
        <!-- Main Grid -->
        <div v-if="directPokemonList.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          <PokemonCard 
            v-for="pokemon in directPokemonList" 
            :key="pokemon.id" 
            :pokemon="pokemon" 
            @toggle-catch="toggleCatch" 
            @view-details="viewDetails" 
            @toggle-favorite="handleToggleFavorite" 
          />
        </div>

        <!-- Empty State -->
        <div v-if="!pokemonStore.isLoading && directPokemonList.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
          <div class="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-gray-700 dark:text-gray-300 font-medium mb-1 text-lg">No Pokémon found</p>
          <p class="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      </div>

      <!-- Caught Pokemon view -->
      <PokemonCaught 
        v-else-if="activeMenu === 'listCaught'" 
        @select-pokemon="showPokemonDetails" 
        @change-tab="handleTabChange" 
      />

      <!-- Favorites view -->
      <PokemonFavorite 
        v-else-if="activeMenu === 'listFavorite'" 
        @select-pokemon="showPokemonDetails" 
        @change-tab="handleTabChange" 
      />

      <!-- Loading Skeletons -->
      <div v-if="pokemonStore.isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-6">
        <PokemonSkeleton v-for="n in 10" :key="`skeleton-${n}`" />
      </div>

      <!-- Infinite Scroll Trigger Element -->
      <div 
        ref="infiniteScrollTrigger" 
        class="h-10 mt-8 w-full flex items-center justify-center"
      >
        <span v-if="activeMenu === 'listPokemon' && !pokemonStore.isLoading && pokemonStore.nextUrl" class="text-xs font-medium text-gray-500 dark:text-gray-500 tracking-wide uppercase">
          Scroll for more
        </span>
      </div>
      
      <!-- Fallback Infinite Scroll Trigger -->
      <div ref="infiniteScrollTriggerFallback" class="h-1 mt-2"></div>
    </main>

    <!-- Detail Modal -->
    <PokemonDetail 
      v-if="selectedPokemon" 
      :pokemon="selectedPokemon" 
      :show="selectedPokemon !== null"
      @close="selectedPokemon = null" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { usePokemonStore } from "@/stores/pokemon";
import PokemonCaught from "@/components/PokemonCaught.vue";
import PokemonFavorite from "@/components/PokemonFavorite.vue";
import PokemonDetail from "@/components/PokemonDetail.vue";
import PokemonSkeleton from "@/components/PokemonSkeleton.vue";
import PokemonCard from "./PokemonCard.vue";
import PokemonHeader from "./PokemonHeader.vue";

// Initialize store
const pokemonStore = usePokemonStore();

// Refs to store state
const pokemons = computed(() => pokemonStore.pokemons);
const pokemonTypes = computed(() => pokemonStore.pokemonTypes);
const selectedType = computed(() => pokemonStore.selectedType);

const displaySelectedType = computed(() => {
  if (!selectedType.value) return "";
  return typeof selectedType.value === "string" ? selectedType.value : selectedType.value.value;
});

// Store actions
const {
  fetchPokemons,
  fetchPokemonTypes,
  searchPokemon,
  loadCaughtPokemons,
  loadFavorites,
  toggleCatch,
  toggleFavorite
} = pokemonStore;

// Local state
const activeMenu = ref("listPokemon");
const selectedPokemon = ref(null);
const infiniteScrollTrigger = ref(null);
const infiniteScrollTriggerFallback = ref(null);
const observer = ref(null);
const isSearching = ref(false);

const directPokemonList = computed(() => {
  if (pokemonStore.filteredPokemons?.length > 0) return pokemonStore.filteredPokemons;
  if (pokemonStore.pokemons?.length > 0) return pokemonStore.pokemons;
  return [];
});

// Methods
const handleSearch = async (query) => {
  try {
    isSearching.value = true;
    const pokemon = await pokemonStore.searchPokemon(query);
    if (pokemon) {
      showPokemonDetails(pokemon);
    }
  } catch (error) {
    console.error("Error searching for Pokémon:", error);
  } finally {
    isSearching.value = false;
    if (pokemonStore.isLoading) pokemonStore.isLoading = false;
  }
};

const showPokemonDetails = (pokemon) => {
  selectedPokemon.value = pokemon;
  isSearching.value = false;
  if (pokemonStore.isLoading) pokemonStore.isLoading = false;
};

const filterByType = (type) => {
  if (!type) return;
  pokemonStore.fetchPokemonByType(type);
};

const clearTypeFilter = () => {
  pokemonStore.resetFilters();
};

const loadMorePokemon = async () => {
  if (pokemonStore.isLoading || !pokemonStore.nextUrl) return;
  try {
    pokemonStore.isLoading = true;
    setTimeout(() => window.scrollBy({ top: 100, behavior: "smooth" }), 100);
    await pokemonStore.fetchPokemons();
  } catch (error) {
    console.error("Error loading more Pokémon:", error);
    pokemonStore.isLoading = false;
  } finally {
    setTimeout(() => {
      if (pokemonStore.isLoading) pokemonStore.isLoading = false;
    }, 500);
  }
};

// Navigation methods
const switchToAllPokemon = () => {
  activeMenu.value = "listPokemon";
  if (!pokemons.value?.length) fetchPokemons();
  if (!pokemonTypes.value?.length) fetchPokemonTypes();
};

const switchToCaught = () => {
  activeMenu.value = "listCaught";
  if (!pokemons.value?.length) {
    fetchPokemons().then(() => loadCaughtPokemons());
  } else {
    loadCaughtPokemons();
  }
};

const switchToFavorite = () => {
  activeMenu.value = "listFavorite";
  loadFavorites();
};

const handleTabChange = (tab) => {
  if (tab === "listPokemon") switchToAllPokemon();
  else if (tab === "listCaught") switchToCaught();
  else if (tab === "listFavorite") switchToFavorite();
  else activeMenu.value = tab;
};

const handleDirectTabChange = (event) => {
  activeMenu.value = event.detail;
  if (event.detail === "listPokemon") {
    if (!pokemons.value?.length) pokemonStore.fetchPokemons();
    if (!pokemonTypes.value?.length) pokemonStore.fetchPokemonTypes();
  } else if (event.detail === "listCaught") {
    pokemonStore.loadCaughtPokemons();
  } else if (event.detail === "listFavorite") {
    pokemonStore.loadFavorites();
  }
};

const viewDetails = (pokemon) => {
  showPokemonDetails(pokemon);
};

const handleToggleFavorite = (pokemon) => {
  if (pokemon) toggleFavorite(pokemon);
};

const setupInfiniteScroll = () => {
  if (observer.value) observer.value.disconnect();

  setTimeout(() => {
    observer.value = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !pokemonStore.isLoading && pokemonStore.nextUrl && activeMenu.value === "listPokemon") {
          loadMorePokemon();
        }
      },
      { rootMargin: "0px 0px 400px 0px", threshold: 0.1 }
    );

    if (infiniteScrollTrigger.value) {
      observer.value.observe(infiniteScrollTrigger.value);
    } else if (infiniteScrollTriggerFallback.value) {
      observer.value.observe(infiniteScrollTriggerFallback.value);
    }
  }, 100);
};

const handleUrlHash = () => {
  const hash = window.location.hash;
  if (hash === "#all-pokemon") switchToAllPokemon();
  else if (hash === "#caught") switchToCaught();
  else if (hash === "#favorite") switchToFavorite();
};

onMounted(() => {
  setupInfiniteScroll();
  fetchPokemons();
  fetchPokemonTypes();
  loadCaughtPokemons();
  handleUrlHash();
  document.addEventListener('change-pokemon-tab', handleDirectTabChange);
});

onUnmounted(() => {
  document.removeEventListener('change-pokemon-tab', handleDirectTabChange);
  if (observer.value) observer.value.disconnect();
});

watch(activeMenu, (newValue) => {
  if (newValue === "listPokemon") {
    if (!pokemons.value?.length) fetchPokemons();
    if (!pokemonTypes.value?.length) fetchPokemonTypes();
    setTimeout(setupInfiniteScroll, 300);
  }
});

watch(
  [() => infiniteScrollTrigger.value, () => infiniteScrollTriggerFallback.value],
  ([primary, fallback]) => {
    if ((primary || fallback) && activeMenu.value === "listPokemon") {
      setupInfiniteScroll();
    }
  }
);
</script>

<style scoped>
/* Scoped styles are intentionally minimal. Tailwind classes handle the layout and styling. */
</style>
