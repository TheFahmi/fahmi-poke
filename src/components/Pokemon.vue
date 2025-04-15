<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pokemon-yellow via-pokemon-red to-pokemon-blue dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-500"
  >
    <!-- Header with Glass Morphism -->
    <header
      class="sticky top-0 z-40 backdrop-blur-md bg-white/10 dark:bg-black/30 shadow-lg py-4 mb-8"
    >
      <div
        class="container mx-auto px-4 flex flex-col md:flex-row items-center"
      >
        <!-- Logo and Title (Left) -->
        <div class="flex items-center mb-4 md:mb-0 md:w-1/4">
          <img
            alt="Pokémon logo"
            src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"
            class="h-10 md:h-12 mr-4"
          />
          <h1 class="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
            Pokédex
          </h1>
        </div>

        <!-- Desktop Search (Center) -->
        <div class="hidden md:flex items-center justify-center md:w-2/4">
          <!-- Search Component in Header (Desktop) -->
          <div class="w-full max-w-xl px-4">
            <PokemonSearch @search="handleSearch" />
          </div>
        </div>

        <!-- Desktop Header Controls (Right) -->
        <div class="hidden md:flex items-center space-x-4 md:w-1/4 md:justify-end">
          <!-- Type Filter Dropdown (Desktop) -->
          <div class="w-48 relative type-dropdown z-40">
            <div class="relative">
              <button
                @click.stop="isTypeDropdownOpen = !isTypeDropdownOpen"
                class="w-full bg-white/90 backdrop-blur-sm text-gray-700 py-2 px-3 rounded-lg shadow-md flex items-center justify-between hover:bg-white transition-colors duration-200 relative text-sm"
                type="button"
              >
                <span class="capitalize font-medium truncate">{{
                  selectedType.value || "Filter by Type"
                }}</span>
                <svg
                  class="w-4 h-4 ml-1 flex-shrink-0 transition-transform duration-200"
                  :class="{ 'rotate-180': isTypeDropdownOpen }"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div class="mt-2 border-t border-gray-200 pt-2">
                    <div
                      v-if="
                        pokemonStore.pokemonTypes &&
                        pokemonStore.pokemonTypes.length > 0
                      "
                      class="grid grid-cols-1 gap-1 mt-1"
                    >
                      <button
                        v-for="type in pokemonStore.pokemonTypes"
                        :key="type.name"
                        @click="filterByType(type.name)"
                        :class="`type-${type.name} bg-opacity-20 hover:bg-opacity-30`"
                        class="text-left px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors duration-150 flex items-center"
                      >
                        <span
                          class="w-3 h-3 rounded-full mr-2"
                          :class="`type-${type.name}`"
                        ></span>
                        {{ type.name }}
                      </button>
                    </div>
                    <div v-else class="text-center py-2 text-gray-500">
                      Loading types...
                      <button
                        @click="handleTypeRetry"
                        class="ml-2 text-blue-500 hover:underline"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Navigation Tabs -->
          <div
            class="flex space-x-2 bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm p-1 rounded-full shadow-inner"
          >
            <button
              @click.prevent.stop="switchToAllPokemon"
              :class="{
                'bg-white text-primary-700 dark:bg-gray-800 dark:text-white shadow-md':
                  activeMenu === 'listPokemon',
                'text-white hover:bg-white/40 dark:hover:bg-gray-700/40':
                  activeMenu !== 'listPokemon',
              }"
              class="px-4 py-1 text-sm font-medium rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
              type="button"
            >
              All Pokémon
            </button>
            <button
              @click.prevent.stop="switchToFavorites"
              :class="{
                'bg-white text-primary-700 dark:bg-gray-800 dark:text-white shadow-md':
                  activeMenu === 'listFavorite',
                'text-white hover:bg-white/40 dark:hover:bg-gray-700/40':
                  activeMenu !== 'listFavorite',
              }"
              class="px-4 py-1 text-sm font-medium rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
              type="button"
            >
              Favorites
            </button>
          </div>

          <!-- Dark Mode Toggle (Desktop) -->
          <DarkModeToggle class="ml-2" />
        </div>

        <!-- Mobile Header Controls -->
        <div class="md:hidden w-full">
          <!-- Mobile Navigation Tabs -->
          <div class="flex justify-center mb-3">
            <div
              class="flex space-x-2 bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm p-1 rounded-full shadow-inner"
            >
              <button
                @click.prevent.stop="switchToAllPokemon"
                :class="{
                  'bg-white text-primary-700 dark:bg-gray-800 dark:text-white shadow-md':
                    activeMenu === 'listPokemon',
                  'text-white hover:bg-white/40 dark:hover:bg-gray-700/40':
                    activeMenu !== 'listPokemon',
                }"
                class="px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
                type="button"
              >
                All
              </button>
              <button
                @click.prevent.stop="switchToFavorites"
                :class="{
                  'bg-white text-primary-700 dark:bg-gray-800 dark:text-white shadow-md':
                    activeMenu === 'listFavorite',
                  'text-white hover:bg-white/40 dark:hover:bg-gray-700/40':
                    activeMenu !== 'listFavorite',
                }"
                class="px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
                type="button"
              >
                Favorites
              </button>
            </div>
          </div>

          <!-- Mobile Utility Row -->
          <div class="px-4 mb-3 flex items-center space-x-2">
            <!-- Search Bar -->
            <div class="flex-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white/70" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search Pokémon..."
                v-model="mobileSearchValue"
                @input="handleMobileInputChange"
                @focus="showMobileSuggestions = true"
                @blur="hideMobileSuggestionsDelayed"
                class="w-full py-2 pl-10 pr-3 rounded-full border-0 bg-white/20 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-white/50 focus:outline-none focus:bg-white/30 transition-all duration-200 text-white placeholder-white/70"
              >
              <button
                v-if="mobileSearchValue"
                type="button"
                @click="clearMobileSearch"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-white/70 hover:text-white transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <!-- Filter Icon -->
            <button
              @click="showMobileFilter = !showMobileFilter"
              class="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <!-- Dark Mode Toggle (Mobile) -->
            <DarkModeToggle class="flex-shrink-0" />
          </div>

          <!-- Mobile Suggestions Dropdown -->
          <div
            v-if="showMobileSuggestions && filteredMobileSuggestions.length > 0 && mobileSearchValue"
            class="fixed z-50 mt-1 mx-4 left-0 right-0 top-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700"
          >
            <ul>
              <li
                v-for="suggestion in filteredMobileSuggestions"
                :key="suggestion.id"
                @mousedown="selectMobileSuggestion(suggestion)"
                class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 transition-colors duration-150 text-gray-800 dark:text-white"
              >
                <img
                  :src="suggestion.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${suggestion.id}.png`"
                  :alt="suggestion.name"
                  class="w-8 h-8 object-contain"
                />
                <div>
                  <span class="font-medium capitalize">{{ suggestion.name }}</span>
                  <span class="text-xs text-gray-600 dark:text-gray-400 ml-2">#{{ suggestion.id }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Search Panel (Shown when search button is clicked) -->
    <div
      v-if="showMobileSearch"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
    >
      <div
        class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-4 shadow-lg w-full max-w-md animate-slide-in-top"
      >
        <h3
          class="text-gray-800 dark:text-white font-medium mb-3 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
          Search Pokémon
        </h3>
        <div class="w-full">
          <PokemonSearch @search="handleMobileSearch" />
        </div>
        <button
          @click="showMobileSearch = false"
          class="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-medium rounded-lg transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Mobile Filter Panel (Shown when filter button is clicked) -->
    <div
      v-if="showMobileFilter"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
    >
      <div
        class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-4 shadow-lg w-full max-w-md animate-slide-in-top"
      >
        <h3
          class="text-gray-800 dark:text-white font-medium mb-3 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clip-rule="evenodd"
            />
          </svg>
          Filter by Type
        </h3>

        <!-- Type Filter Buttons -->
        <div
          v-if="
            pokemonStore.pokemonTypes && pokemonStore.pokemonTypes.length > 0
          "
          class="grid grid-cols-2 gap-2 mb-3"
        >
          <button
            @click="clearTypeFilterAndClose"
            class="text-left px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors duration-150 flex items-center bg-blue-500 text-white hover:bg-blue-600"
          >
            <span class="w-3 h-3 rounded-full mr-2 bg-white"></span>
            All Types
          </button>
          <button
            v-for="type in pokemonStore.pokemonTypes"
            :key="type.name"
            @click="filterByTypeAndClose(type.name)"
            :class="`type-${type.name} bg-opacity-20 hover:bg-opacity-30`"
            class="text-left px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors duration-150 flex items-center"
          >
            <span
              class="w-3 h-3 rounded-full mr-2"
              :class="`type-${type.name}`"
            ></span>
            {{ type.name }}
          </button>
        </div>
        <div v-else class="text-center py-2 text-gray-500 dark:text-gray-300">
          Loading types...
          <button
            @click="handleTypeRetry"
            class="ml-2 text-blue-500 hover:underline"
          >
            Retry
          </button>
        </div>

        <button
          @click="showMobileFilter = false"
          class="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-medium rounded-lg transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>

    <div class="container mx-auto px-4 pb-12">
      <!-- Loading Indicator -->
      <div v-if="pokemonStore.isLoading" class="py-12 flex justify-center">
        <Loading />
      </div>

      <!-- Main content -->
      <div class="mt-8">
        <!-- Introduction Section -->
        <div v-if="activeMenu === 'listPokemon'" class="mb-8 text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">
            Explore the World of Pokémon
          </h2>
          <p class="text-white/80 max-w-3xl mx-auto mb-6">
            Discover and learn about all your favorite Pokémon from different
            generations. Use the search and filter options to find specific
            Pokémon by name, ID, or type.
          </p>
          <div class="flex flex-wrap justify-center gap-3 mb-6">
            <span
              class="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm text-white"
              >{{ directPokemonList.length }} Pokémon Available</span
            >
            <span
              v-if="selectedType.value"
              class="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm text-white capitalize"
              >Type: {{ selectedType.value }}</span
            >
          </div>
        </div>

        <!-- Pokemon list section -->
        <section
          v-if="activeMenu === 'listPokemon'"
          class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <!-- Display Pokemon Card - Redesigned -->
          <div
            v-for="pokemon in directPokemonList"
            :key="pokemon.id"
            class="group relative bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2"
          >
            <!-- Card Header with Pokémon ID -->
            <div
              class="absolute top-3 left-3 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold text-white"
            >
              #{{ pokemon.id.padStart(3, "0") }}
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
            <div
              class="relative h-48 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white/5 to-white/20"
            >
              <!-- Pokemon Image -->
              <img
                v-if="
                  pokemon.sprites &&
                  pokemon.sprites.other &&
                  pokemon.sprites.other['official-artwork'] &&
                  pokemon.sprites.other['official-artwork'].front_default
                "
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
              <div v-else class="h-40 w-40 flex items-center justify-center">
                <div class="text-white/50">Loading...</div>
              </div>

              <!-- Type Badges on Image -->
              <div
                class="absolute bottom-2 left-0 right-0 flex justify-center gap-2"
              >
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
              <h3
                class="text-xl font-bold text-white capitalize text-center mb-2"
              >
                {{ pokemon.name }}
              </h3>

              <!-- Pokemon Stats Preview (optional) -->
              <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-white/80">
                <div
                  class="flex flex-col items-center bg-white/10 rounded-lg p-2"
                >
                  <span class="text-white/60">Height</span>
                  <span class="font-bold text-white">{{
                    pokemon.height
                      ? `${(pokemon.height / 10).toFixed(1)}m`
                      : "N/A"
                  }}</span>
                </div>
                <div
                  class="flex flex-col items-center bg-white/10 rounded-lg p-2"
                >
                  <span class="text-white/60">Weight</span>
                  <span class="font-bold text-white">{{
                    pokemon.weight
                      ? `${(pokemon.weight / 10).toFixed(1)}kg`
                      : "N/A"
                  }}</span>
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
        </section>

        <!-- Loading Skeletons for Infinite Scroll -->
        <div
          v-if="activeMenu === 'listPokemon' && pokemonStore.isLoading"
          class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto mt-6"
        >
          <PokemonSkeleton v-for="n in 5" :key="`infinite-skeleton-${n}`" />
        </div>

        <!-- Infinite Scroll Trigger Element -->
        <div
          ref="infiniteScrollTrigger"
          class="py-4 mt-2"
          v-if="activeMenu === 'listPokemon' && pokemonStore.nextUrl"
        >
          <div class="text-center">
            <span
              v-if="!pokemonStore.isLoading"
              class="text-white/60 text-xs bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
            >
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { usePokemonStore } from "@/stores/pokemon";
import PokemonSearch from "@/components/PokemonSearch.vue";
import PokemonList from "@/components/PokemonList.vue";
import PokemonFavorite from "@/components/PokemonFavorite.vue";
import PokemonDetail from "@/components/PokemonDetail.vue";
import PokemonSkeleton from "@/components/PokemonSkeleton.vue";
import Loading from "@/components/Loading.vue";
import LoadingDots from "@/components/LoadingDots.vue";
import DarkModeToggle from "@/components/DarkModeToggle.vue";

// Initialize store
const pokemonStore = usePokemonStore();

// Refs ke state store
const pokemons = computed(() => pokemonStore.pokemons);
const filteredPokemons = computed(() => pokemonStore.filteredPokemons);
const pokemonTypes = computed(() => pokemonStore.pokemonTypes);
const isLoading = computed(() => pokemonStore.isLoading);
const selectedType = computed(() => pokemonStore.selectedType);
const nextUrl = computed(() => pokemonStore.nextUrl);
const error = computed(() => pokemonStore.error);

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
  toggleFavorite,
} = pokemonStore;

// Local state
const activeMenu = ref("listPokemon");
const selectedPokemon = ref(null);
const isTypeDropdownOpen = ref(false);
const showMobileSearch = ref(false);
const showMobileFilter = ref(false);
const showMobileMenu = ref(false);
const infiniteScrollTrigger = ref(null);
const infiniteScrollTriggerFallback = ref(null);
const observer = ref(null);

// Mobile search state
const mobileSearchValue = ref('');
const showMobileSuggestions = ref(false);
const mobileSuggestions = ref([]);
const mobileBlurTimeout = ref(null);

// Computed for mobile suggestions
const filteredMobileSuggestions = computed(() => {
  if (!mobileSearchValue.value) return [];

  const query = mobileSearchValue.value.toLowerCase();
  return pokemonStore.pokemons
    .filter(pokemon => pokemon.name.toLowerCase().includes(query))
    .slice(0, 5); // Limit to 5 suggestions
});

// Add direct access to store data
const directPokemonList = computed(() => {
  // Try multiple sources in order of preference
  if (pokemonStore.filteredPokemons?.length > 0) {
    return pokemonStore.filteredPokemons;
  }

  if (pokemonStore.pokemons?.length > 0) {
    return pokemonStore.pokemons;
  }

  if (window.pokemonStore?.pokemons?.length > 0) {
    return window.pokemonStore.pokemons;
  }

  return [];
});

// Methods
const handleSearch = async (query) => {
  try {
    const pokemon = await searchPokemon(query);
    if (pokemon) {
      showPokemonDetails(pokemon);
    }
  } catch (error) {
    console.error("Error searching for Pokémon:", error);
  }
};

const showPokemonDetails = (pokemon) => {
  selectedPokemon.value = pokemon;
};

const filterByType = (type) => {
  try {
    if (!type) return;
    pokemonStore.fetchPokemonByType(type);
    isTypeDropdownOpen.value = false;
  } catch (error) {
    console.error("Error filtering by type:", error);
  }
};

// Filter by type and close mobile filter panel
const filterByTypeAndClose = (type) => {
  filterByType(type);
  showMobileFilter.value = false;
};

const clearTypeFilter = () => {
  try {
    pokemonStore.resetFilters();
    isTypeDropdownOpen.value = false;
  } catch (error) {
    console.error("Error clearing type filter:", error);
  }
};

// Clear type filter and close mobile filter panel
const clearTypeFilterAndClose = () => {
  clearTypeFilter();
  showMobileFilter.value = false;
};

// Handle mobile search
const handleMobileSearch = async (query) => {
  try {
    const pokemon = await searchPokemon(query);
    if (pokemon) {
      showPokemonDetails(pokemon);
      // Close the mobile search after searching
      showMobileSearch.value = false;
    }
  } catch (error) {
    console.error("Error searching for Pokémon:", error);
  }
};

const loadMorePokemon = async () => {
  try {
    // Set loading state to true to show skeleton loaders
    pokemonStore.isLoading = true;

    // Scroll to show the skeleton loaders
    setTimeout(() => {
      window.scrollBy({
        top: 100,
        behavior: 'smooth'
      });
    }, 100);

    // Fetch more Pokemon
    await pokemonStore.fetchPokemons();
  } catch (error) {
    console.error("Error loading more Pokémon:", error);
  } finally {
    // Make sure loading state is reset
    setTimeout(() => {
      if (pokemonStore.isLoading) {
        pokemonStore.isLoading = false;
      }
    }, 500);
  }
};

// Navigation methods
const switchToAllPokemon = () => {
  activeMenu.value = "listPokemon";

  if (!pokemons.value || pokemons.value.length === 0) {
    fetchPokemons();
  }

  if (!pokemonTypes.value || pokemonTypes.value.length === 0) {
    fetchPokemonTypes();
  }
};

const switchToFavorites = () => {
  activeMenu.value = "listFavorite";
  loadFavorites();
};

// Handle tab change from child components
const handleTabChange = (tab) => {
  try {
    if (tab === "listPokemon") {
      switchToAllPokemon();
    } else if (tab === "listFavorite") {
      switchToFavorites();
    }
  } catch (error) {
    console.error("Error changing tabs:", error);
    activeMenu.value = tab;
  }
};

// Handle direct tab change from custom event
const handleDirectTabChange = (event) => {
  try {
    activeMenu.value = event.detail;

    if (event.detail === "listPokemon") {
      if (!pokemons.value || pokemons.value.length === 0) {
        pokemonStore.fetchPokemons();
      }
      if (!pokemonTypes.value || pokemonTypes.value.length === 0) {
        pokemonStore.fetchPokemonTypes();
      }
    } else if (event.detail === "listFavorite") {
      pokemonStore.loadFavorites();
    }
  } catch (error) {
    console.error("Error handling tab change:", error);
  }
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (isTypeDropdownOpen.value && !event.target.closest(".type-dropdown")) {
    isTypeDropdownOpen.value = false;
  }
};

// Handler untuk tombol favorite
const togglePokemonFavorite = (pokemon) => {
  try {
    if (typeof pokemonStore.toggleFavorite === "function") {
      pokemonStore.toggleFavorite(pokemon);
    } else {
      pokemon.isLike = !pokemon.isLike;

      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

      if (pokemon.isLike) {
        if (!favorites.includes(pokemon.id)) {
          favorites.push(pokemon.id);
        }
      } else {
        const index = favorites.indexOf(pokemon.id);
        if (index !== -1) {
          favorites.splice(index, 1);
        }
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
};

// Mobile search functions
const handleMobileInputChange = async () => {
  showMobileSuggestions.value = true;

  // If we have few suggestions and there are more Pokemon to load, load them
  if (filteredMobileSuggestions.value.length < 3 && pokemonStore.pokemons.length < 150 && pokemonStore.nextUrl) {
    try {
      await pokemonStore.fetchPokemons();
    } catch (error) {
      console.error('Error loading more Pokemon for suggestions:', error);
    }
  }
};

const selectMobileSuggestion = (suggestion) => {
  mobileSearchValue.value = suggestion.name;
  showPokemonDetails(suggestion);
  showMobileSuggestions.value = false;
};

const clearMobileSearch = () => {
  mobileSearchValue.value = '';
  showMobileSuggestions.value = false;
};

const hideMobileSuggestionsDelayed = () => {
  // Use timeout to allow click events on suggestions to fire before hiding
  mobileBlurTimeout.value = setTimeout(() => {
    showMobileSuggestions.value = false;
  }, 200);
};

// Set up infinite scroll observer
const setupInfiniteScroll = () => {
  try {
    // Disconnect previous observer if it exists
    if (observer.value) {
      observer.value.disconnect();
    }

    // Wait briefly to ensure DOM is updated
    setTimeout(() => {
      // Create a new IntersectionObserver
      observer.value = new IntersectionObserver(
        (entries) => {
          // If the trigger element is visible and we're not already loading
          if (entries[0].isIntersecting && !pokemonStore.isLoading && pokemonStore.nextUrl) {
            console.log("Trigger observed, loading more Pokemon...");
            // Show skeleton loaders immediately
            pokemonStore.isLoading = true;
            // Use setTimeout to allow the UI to update with skeleton loaders
            setTimeout(() => {
              loadMorePokemon();
            }, 100);
          }
        },
        {
          root: null, // Use the viewport as the root
          rootMargin: "0px 0px 400px 0px", // Start loading when within 400px of the bottom
          threshold: 0.1, // Trigger when 10% of the element is visible
        }
      );

      // Start observing the primary trigger element if it exists
      if (infiniteScrollTrigger.value) {
        observer.value.observe(infiniteScrollTrigger.value);
        console.log("Observing primary infinite scroll trigger");
      } else if (infiniteScrollTriggerFallback.value) {
        // Use fallback element if primary doesn't exist
        observer.value.observe(infiniteScrollTriggerFallback.value);
        console.log("Observing fallback infinite scroll trigger");
      } else {
        // Try again after a longer delay as a fallback
        console.log("No scroll triggers found, retrying setup in 1s");
        setTimeout(setupInfiniteScroll, 1000);
      }
    }, 100);
  } catch (error) {
    console.error("Error setting up infinite scroll:", error);
  }
};

// Pastikan tipe Pokemon selalu tersedia
const ensureTypesLoaded = () => {
  try {
    if (!pokemonTypes.value || pokemonTypes.value.length === 0) {
      console.log("Types not loaded, fetching...");
      fetchPokemonTypes();

      // Langsung ambil dari window store jika tersedia
      if (
        window.pokemonStore?.pokemonTypes &&
        window.pokemonStore.pokemonTypes.length > 0
      ) {
        console.log("Using types from global store");
        pokemonStore.$patch({
          pokemonTypes: [...window.pokemonStore.pokemonTypes],
        });
      }
    }
  } catch (error) {
    console.error("Error ensuring types are loaded:", error);
  }
};

onMounted(async () => {
  // Ensure types are loaded immediately
  ensureTypesLoaded();

  // Ensure store is initialized
  if (!pokemons.value || pokemons.value.length === 0) {
    if (
      window.pokemonStore &&
      window.pokemonStore.pokemons &&
      window.pokemonStore.pokemons.length > 0
    ) {
      // Use global store data directly
      pokemonStore.$patch({
        pokemons: [...window.pokemonStore.pokemons],
        pokemonTypes: [...(window.pokemonStore.pokemonTypes || [])],
        selectedType: window.pokemonStore.selectedType,
      });
    } else {
      // Initialize store normally
      pokemonStore.init();

      // Load more data after initial load
      setTimeout(async () => {
        // Load first batch of additional Pokemon
        if (pokemonStore.pokemons.length < 200 && pokemonStore.nextUrl) {
          try {
            await pokemonStore.fetchPokemons();
            console.log('Loaded first batch of additional Pokemon, total:', pokemonStore.pokemons.length);

            // Load second batch of additional Pokemon after a short delay
            setTimeout(async () => {
              if (pokemonStore.pokemons.length < 300 && pokemonStore.nextUrl) {
                try {
                  await pokemonStore.fetchPokemons();
                  console.log('Loaded second batch of additional Pokemon, total:', pokemonStore.pokemons.length);
                } catch (error) {
                  console.error('Error loading second batch of Pokemon:', error);
                }
              }
            }, 1000);
          } catch (error) {
            console.error('Error loading first batch of Pokemon:', error);
          }
        }
      }, 1000);
    }
  }

  // Add click outside listener
  document.addEventListener("click", handleClickOutside);

  // Listen for direct tab change events
  document.addEventListener("change-pokemon-tab", handleDirectTabChange);

  // Handle hash navigation
  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();

  // Set up infinite scroll after a short delay to ensure the DOM is ready
  setTimeout(() => {
    setupInfiniteScroll();
  }, 500);
});

// Handle hash navigation
const handleHashChange = () => {
  const hash = window.location.hash;

  if (hash === "#all-pokemon") {
    switchToAllPokemon();
  } else if (hash === "#favorites") {
    switchToFavorites();
  }
};

// Clean up event listeners
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("change-pokemon-tab", handleDirectTabChange);
  window.removeEventListener("hashchange", handleHashChange);

  // Clean up the IntersectionObserver
  if (observer.value) {
    observer.value.disconnect();
    observer.value = null;
  }
});

// Watch for active menu changes
watch(activeMenu, (newValue) => {
  if (newValue === "listPokemon") {
    // Ensure we have data when switching to Pokemon list
    if (!pokemons.value || pokemons.value.length === 0) {
      fetchPokemons();
    }

    if (!pokemonTypes.value || pokemonTypes.value.length === 0) {
      fetchPokemonTypes();
    }

    // Give time for the DOM to update
    setTimeout(() => {
      setupInfiniteScroll();
    }, 300);
  }
});

// Watch for both trigger elements
watch(
  [
    () => infiniteScrollTrigger.value,
    () => infiniteScrollTriggerFallback.value,
  ],
  ([primary, fallback]) => {
    if ((primary || fallback) && activeMenu.value === "listPokemon") {
      setupInfiniteScroll();
    }
  }
);

// Update fetchPokemonTypes function call
const handleTypeRetry = () => {
  try {
    fetchPokemonTypes();

    // Juga coba ambil dari store global jika tersedia
    if (
      window.pokemonStore?.pokemonTypes &&
      window.pokemonStore.pokemonTypes.length > 0
    ) {
      pokemonStore.$patch({
        pokemonTypes: [...window.pokemonStore.pokemonTypes],
      });
    }
  } catch (error) {
    console.error("Error fetching types on retry:", error);
  }
};
</script>

<style scoped>
/* Animations */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-in-top {
  animation: slideInTop 0.3s ease-out forwards;
}

@keyframes slideInTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Type colors for filter buttons */
.type-normal {
  background-color: #a8a878;
  color: white;
}
.type-fire {
  background-color: #f08030;
  color: white;
}
.type-water {
  background-color: #6890f0;
  color: white;
}
.type-grass {
  background-color: #78c850;
  color: white;
}
.type-electric {
  background-color: #f8d030;
  color: black;
}
.type-ice {
  background-color: #98d8d8;
  color: black;
}
.type-fighting {
  background-color: #c03028;
  color: white;
}
.type-poison {
  background-color: #a040a0;
  color: white;
}
.type-ground {
  background-color: #e0c068;
  color: black;
}
.type-flying {
  background-color: #a890f0;
  color: white;
}
.type-psychic {
  background-color: #f85888;
  color: white;
}
.type-bug {
  background-color: #a8b820;
  color: white;
}
.type-rock {
  background-color: #b8a038;
  color: white;
}
.type-ghost {
  background-color: #705898;
  color: white;
}
.type-dragon {
  background-color: #7038f8;
  color: white;
}
.type-dark {
  background-color: #705848;
  color: white;
}
.type-steel {
  background-color: #b8b8d0;
  color: black;
}
.type-fairy {
  background-color: #ee99ac;
  color: black;
}
</style>
