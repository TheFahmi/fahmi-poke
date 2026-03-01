<template>
  <header
    class="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700/50 transition-colors duration-300 shadow-sm"
  >
    <div class="container mx-auto px-4 py-3">
      <!-- Top Row: Logo, Search, and Actions -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        
        <!-- Logo & Title -->
        <div class="flex items-center w-full md:w-auto justify-between md:justify-start gap-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight font-sans">
              Pokédex
            </h1>
          </div>
          
          <!-- Mobile Controls (Right side of Logo row) -->
          <div class="flex md:hidden items-center gap-2">
            <DarkModeToggle />
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Desktop Navigation & Controls -->
        <div class="hidden md:flex items-center gap-6 w-full md:w-auto flex-1 justify-end">
          
          <!-- Navigation Tabs -->
          <nav class="flex items-center space-x-1 bg-gray-100 dark:bg-slate-800/50 p-1 rounded-lg border border-gray-200 dark:border-slate-700/50">
            <button
              @click="switchToAllPokemon"
              :class="[
                'px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                activeMenu === 'listPokemon' 
                  ? 'bg-indigo-500 text-white shadow-sm' 
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'
              ]"
            >
              All
            </button>
            <button
              @click="switchToCaught"
              :class="[
                'px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                activeMenu === 'listCaught' 
                  ? 'bg-indigo-500 text-white shadow-sm' 
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'
              ]"
            >
              Caught
            </button>
            <button
              @click="switchToFavorite"
              :class="[
                'px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                activeMenu === 'listFavorite' 
                  ? 'bg-indigo-500 text-white shadow-sm' 
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'
              ]"
            >
              Favorites
            </button>
          </nav>

          <!-- Search Bar -->
          <div class="relative w-64">
            <PokemonSearch @search="handleSearch" class="search-input-wrapper" :isSearching="isSearching" />
          </div>

          <!-- Type Filter Dropdown -->
          <div class="relative type-dropdown" ref="desktopDropdownRef">
            <button
              @click.stop="toggleTypeDropdown"
              class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
              <span class="capitalize">{{ selectedType?.value || 'All Types' }}</span>
              <svg class="w-4 h-4 text-gray-500 dark:text-slate-400 transition-transform" :class="{ 'rotate-180': isTypeDropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-if="isTypeDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 transform origin-top-right transition-all"
            >
              <div class="max-h-80 overflow-y-auto py-1 custom-scrollbar">
                <button
                  @click="clearTypeFilter"
                  class="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
                >
                  <div class="w-2 h-2 rounded-full bg-gray-400 dark:bg-slate-400"></div>
                  All Types
                </button>
                <div class="h-px bg-gray-200 dark:bg-slate-700 my-1"></div>
                
                <template v-if="pokemonStore.pokemonTypes?.length">
                  <button
                    v-for="type in pokemonStore.pokemonTypes"
                    :key="type.name"
                    @click="filterByType(type.name)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 capitalize"
                    :class="{ 'bg-gray-100 dark:bg-slate-700/50 text-gray-900 dark:text-white': selectedType?.value === type.name }"
                  >
                    <div class="w-2 h-2 rounded-full" :class="`bg-pokemon-${type.name}`"></div>
                    {{ type.name }}
                  </button>
                </template>
                <div v-else class="px-4 py-3 text-sm text-gray-500 dark:text-slate-500 text-center">
                  Loading...
                </div>
              </div>
            </div>
          </div>

          <DarkModeToggle />
        </div>
      </div>

      <!-- Mobile Menu Collapse -->
      <div 
        v-show="isMobileMenuOpen"
        class="md:hidden mt-4 space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700/50"
      >
        <!-- Mobile Tabs -->
        <div class="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-slate-800/50 p-1 rounded-lg border border-gray-200 dark:border-slate-700/50">
          <button
            @click="switchToAllPokemon"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              activeMenu === 'listPokemon' 
                ? 'bg-indigo-500 text-white' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            ]"
          >
            All Pokémon
          </button>
          <button
            @click="switchToCaught"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              activeMenu === 'listCaught' 
                ? 'bg-indigo-500 text-white' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            ]"
          >
            Caught
          </button>
          <button
            @click="switchToFavorite"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              activeMenu === 'listFavorite' 
                ? 'bg-indigo-500 text-white' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            ]"
          >
            Favorites
          </button>
        </div>

        <!-- Mobile Search -->
        <div class="relative w-full">
          <PokemonSearch @search="handleSearch" class="search-input-wrapper w-full" :isSearching="isSearching" />
        </div>

        <!-- Mobile Type Filter -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-2">Filter by Type</label>
          <div class="flex flex-wrap gap-2">
            <button
              @click="clearTypeFilter"
              class="px-3 py-1.5 text-xs font-medium rounded-full border transition-colors flex items-center gap-1.5"
              :class="!selectedType?.value ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-500/20 dark:border-indigo-500/50 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-200'"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
              All
            </button>
            <button
              v-for="type in pokemonStore.pokemonTypes"
              :key="type.name"
              @click="filterByType(type.name)"
              class="px-3 py-1.5 text-xs font-medium rounded-full border transition-colors flex items-center gap-1.5 capitalize"
              :class="selectedType?.value === type.name ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-500/20 dark:border-indigo-500/50 text-indigo-700 dark:text-white' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-200'"
            >
              <div class="w-1.5 h-1.5 rounded-full" :class="`bg-pokemon-${type.name}`"></div>
              {{ type.name }}
            </button>
          </div>
        </div>
      </div>
      
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePokemonStore } from '../stores/pokemon';
import PokemonSearch from './PokemonSearch.vue';
import DarkModeToggle from './DarkModeToggle.vue';

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'listPokemon'
  },
  isSearching: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'search', 
  'filter-by-type', 
  'clear-type-filter', 
  'switch-to-all-pokemon', 
  'switch-to-caught',
  'switch-to-favorite'
]);

const pokemonStore = usePokemonStore();
const isTypeDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const desktopDropdownRef = ref(null);

const selectedType = computed(() => pokemonStore.selectedType);

// Actions
const handleSearch = (query) => {
  emit('search', query);
  
  // Failsafe timeout for loading spinner
  setTimeout(() => {
    if (pokemonStore.isLoading) {
      pokemonStore.isLoading = false;
    }
  }, 10000);
};

const filterByType = (type) => {
  emit('filter-by-type', type);
  isTypeDropdownOpen.value = false;
  if (window.innerWidth < 768) {
    isMobileMenuOpen.value = false;
  }
};

const clearTypeFilter = () => {
  emit('clear-type-filter');
  isTypeDropdownOpen.value = false;
};

const switchToAllPokemon = () => {
  emit('switch-to-all-pokemon');
  if (window.innerWidth < 768) {
    isMobileMenuOpen.value = false;
  }
};

const switchToCaught = () => {
  emit('switch-to-caught');
  if (window.innerWidth < 768) {
    isMobileMenuOpen.value = false;
  }
};

const switchToFavorite = () => {
  emit('switch-to-favorite');
  if (window.innerWidth < 768) {
    isMobileMenuOpen.value = false;
  }
};
const toggleTypeDropdown = () => {
  isTypeDropdownOpen.value = !isTypeDropdownOpen.value;
};

// Click outside handler
const handleClickOutside = (event) => {
  if (isTypeDropdownOpen.value && desktopDropdownRef.value && !desktopDropdownRef.value.contains(event.target)) {
    isTypeDropdownOpen.value = false;
  }
};

const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    isTypeDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);
});
</script>

<style scoped>
/* Base typography reset for component */
* {
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Custom scrollbar for dropdown */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
}

/* Deep selection to style the search input */
:deep(.search-input-wrapper input) {
  width: 100%;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #1e293b;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

:deep(.dark .search-input-wrapper input) {
  background-color: #1e293b;
  border: 1px solid #334155;
  color: #f1f5f9;
}

:deep(.search-input-wrapper input:focus) {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  background-color: #ffffff;
}

:deep(.dark .search-input-wrapper input:focus) {
  background-color: #0f172a;
}

:deep(.search-input-wrapper input::placeholder) {
  color: #64748b;
}

:deep(.search-input-wrapper svg) {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #64748b;
  pointer-events: none;
}

/* Base colors for type indicators */
.bg-pokemon-normal { background-color: #a8a878; }
.bg-pokemon-fire { background-color: #f08030; }
.bg-pokemon-water { background-color: #6890f0; }
.bg-pokemon-grass { background-color: #78c850; }
.bg-pokemon-electric { background-color: #f8d030; }
.bg-pokemon-ice { background-color: #98d8d8; }
.bg-pokemon-fighting { background-color: #c03028; }
.bg-pokemon-poison { background-color: #a040a0; }
.bg-pokemon-ground { background-color: #e0c068; }
.bg-pokemon-flying { background-color: #a890f0; }
.bg-pokemon-psychic { background-color: #f85888; }
.bg-pokemon-bug { background-color: #a8b820; }
.bg-pokemon-rock { background-color: #b8a038; }
.bg-pokemon-ghost { background-color: #705898; }
.bg-pokemon-dragon { background-color: #7038f8; }
.bg-pokemon-dark { background-color: #705848; }
.bg-pokemon-steel { background-color: #b8b8d0; }
.bg-pokemon-fairy { background-color: #ee99ac; }
</style>
