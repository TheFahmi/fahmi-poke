<template>
  <!-- Modal Backdrop with Animation -->
  <div
    class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
    @click="closeModal"
  >
    <!-- Modal Content -->
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden transform transition-all animate-fade-in my-8"
      @click.stop
    >
      <!-- Pokemon Header with Image - Redesigned -->
      <div
        class="relative h-64 flex items-center justify-center overflow-hidden"
        :class="`bg-gradient-to-br from-${primaryType}-light via-${primaryType}-main to-${primaryType}-dark`"
      >
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="w-full h-full flex flex-wrap">
            <div v-for="n in 20" :key="n" class="w-10 h-10 border border-white rounded-full"></div>
          </div>
        </div>
        
        <!-- Pokemon Category Pill -->
        <div class="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg">
          #{{ formatPokemonId(pokemon.id) }} {{ pokemon.species?.name || pokemon.name }}
        </div>

        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 bg-white/20 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Pokemon Image with Shadow -->
        <div class="relative z-10 transform transition-all duration-700 hover:scale-110 drop-shadow-2xl">
          <img
            :src="getPokemonImage(pokemon)"
            :alt="pokemon.name"
            class="h-48 w-48 object-contain"
          >
          <div class="absolute -bottom-4 w-24 h-3 bg-black/20 rounded-full blur-sm mx-auto left-0 right-0"></div>
        </div>

        <!-- Pokemon Name Badge -->
        <div class="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md p-3 flex justify-between items-center">
          <h2 class="text-2xl font-bold capitalize text-white drop-shadow-md">
            {{ pokemon.name }}
          </h2>
          
          <!-- Types -->
          <div class="flex gap-2">
            <span
              v-for="typeInfo in pokemon.types"
              :key="typeInfo.type.name"
              :class="`type-${typeInfo.type.name}`"
              class="px-3 py-1 rounded-full text-xs font-bold text-white capitalize shadow-md flex items-center gap-1"
            >
              <span class="w-2 h-2 bg-white/50 rounded-full"></span>
              {{ typeInfo.type.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pokemon Details -->
      <div class="p-6 overflow-y-auto max-h-[calc(100vh-20rem)]">
        <!-- Tabs Navigation - Redesigned -->
        <div class="mb-8 sticky top-0 bg-white z-10 pb-2">
          <div class="flex overflow-x-auto space-x-2 p-1 bg-gray-100 rounded-xl">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200',
                activeTab === tab.id 
                  ? `bg-white text-${primaryType}-main shadow-md`
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
              ]"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- Stats and Info Grid - Base tab -->
        <div v-if="activeTab === 'base'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Info - Redesigned -->
          <div class="bg-gray-50 rounded-xl p-5 shadow-inner">
            <h3 class="text-lg font-semibold mb-4 text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              Pokémon Info
            </h3>

            <div class="space-y-3">
              <div class="flex justify-between items-center py-2 border-b border-gray-200 group hover:bg-gray-100 rounded px-2 -mx-2 transition-colors">
                <span class="text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd" />
                  </svg>
                  Height
                </span>
                <span class="font-medium text-gray-800 bg-blue-50 px-2 py-1 rounded">{{ (pokemon.height / 10).toFixed(1) }} m</span>
              </div>

              <div class="flex justify-between items-center py-2 border-b border-gray-200 group hover:bg-gray-100 rounded px-2 -mx-2 transition-colors">
                <span class="text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
                  </svg>
                  Weight
                </span>
                <span class="font-medium text-gray-800 bg-blue-50 px-2 py-1 rounded">{{ (pokemon.weight / 10).toFixed(1) }} kg</span>
              </div>

              <div class="flex justify-between items-center py-2 border-b border-gray-200 group hover:bg-gray-100 rounded px-2 -mx-2 transition-colors">
                <span class="text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Base Experience
                </span>
                <span class="font-medium text-gray-800 bg-blue-50 px-2 py-1 rounded">{{ pokemon.base_experience || 'N/A' }} XP</span>
              </div>
              
              <div v-if="pokemon.order" class="flex justify-between items-center py-2 border-b border-gray-200 group hover:bg-gray-100 rounded px-2 -mx-2 transition-colors">
                <span class="text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                  Order
                </span>
                <span class="font-medium text-gray-800 bg-blue-50 px-2 py-1 rounded">#{{ pokemon.order }}</span>
              </div>
              
              <div v-if="pokemon.is_default !== undefined" class="flex justify-between items-center py-2 border-b border-gray-200 group hover:bg-gray-100 rounded px-2 -mx-2 transition-colors">
                <span class="text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Default Form
                </span>
                <span class="font-medium text-gray-800 bg-blue-50 px-2 py-1 rounded">{{ pokemon.is_default ? 'Yes' : 'No' }}</span>
              </div>
              
              <div v-if="pokemon.species?.name" class="flex justify-between items-center py-2 border-b border-gray-200 group hover:bg-gray-100 rounded px-2 -mx-2 transition-colors">
                <span class="text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clip-rule="evenodd" />
                  </svg>
                  Species
                </span>
                <span class="font-medium text-gray-800 bg-blue-50 px-2 py-1 rounded capitalize">{{ pokemon.species.name }}</span>
              </div>
            </div>

            <!-- Abilities - Redesigned -->
            <h3 class="text-lg font-semibold mt-6 mb-4 text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              Abilities
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="ability in pokemon.abilities"
                :key="ability.ability.name"
                class="px-3 py-2 rounded-lg text-sm capitalize flex items-center transition-transform hover:scale-105"
                :class="ability.is_hidden 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700'"
              >
                <span v-if="ability.is_hidden" class="w-2 h-2 bg-white rounded-full mr-2"></span>
                {{ ability.ability.name.replace('-', ' ') }}
                <span v-if="ability.is_hidden" class="text-xs text-white/80 ml-1">(Hidden)</span>
              </span>
            </div>
          </div>

          <!-- Stats - Redesigned -->
          <div class="bg-gray-50 rounded-xl p-5 shadow-inner">
            <h3 class="text-lg font-semibold mb-4 text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Base Stats
            </h3>

            <div class="space-y-4">
              <div v-for="stat in pokemon.stats" :key="stat.stat.name" 
                   class="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between mb-1 items-center">
                  <span class="text-sm font-medium text-gray-700 capitalize flex items-center">
                    <span :class="`w-3 h-3 rounded-full mr-2 bg-${statColor(stat.stat.name)}-500`"></span>
                    {{ formatStatName(stat.stat.name) }}
                  </span>
                  <span class="text-sm font-bold text-gray-900">{{ stat.base_stat }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="h-2.5 rounded-full animate-grow-stat"
                    :class="`bg-${statColor(stat.stat.name)}-500`"
                    :style="{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }"
                  ></div>
                </div>
              </div>
              
              <!-- Total Stats -->
              <div v-if="pokemon.stats && pokemon.stats.length > 0" 
                   class="mt-6 pt-4 border-t border-gray-200 p-3 bg-gradient-to-r from-gray-100 to-white rounded-lg">
                <div class="flex justify-between mb-2 items-center">
                  <span class="text-sm font-bold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd" />
                    </svg>
                    TOTAL
                  </span>
                  <span class="text-base font-extrabold text-gray-900">{{ calculateTotalStats() }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    class="h-3 rounded-full shadow-inner animate-grow-stat"
                    :class="`bg-gradient-to-r from-${primaryType}-main to-${primaryType}-dark`"
                    :style="{ width: `${Math.min(100, (calculateTotalStats() / 600) * 100)}%` }"
                  ></div>
                </div>
                <div class="mt-2 text-xs text-gray-500 text-right">
                  {{ calculateStatRating(calculateTotalStats()) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sprites tab - Redesigned -->
        <div v-else-if="activeTab === 'sprites'" class="bg-gray-50 rounded-xl p-5 shadow-inner">
          <h3 class="text-lg font-semibold mb-5 text-gray-700 flex items-center sticky top-0 bg-gray-50 z-10 pb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
            Sprites Gallery
          </h3>
          
          <!-- Main artwork showcase -->
          <div class="mb-8 flex flex-col items-center">
            <h4 class="text-sm font-medium text-gray-500 mb-3">Official Artwork</h4>
            <div class="bg-gradient-to-br from-white to-gray-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-sm mx-auto">
              <img 
                v-if="pokemon.sprites?.other?.['official-artwork']?.front_default" 
                :src="pokemon.sprites.other['official-artwork'].front_default" 
                alt="Official Artwork" 
                class="h-48 w-48 object-contain mx-auto drop-shadow-xl animate-float"
              />
            </div>
          </div>
          
          <!-- Sprite categories -->
          <div class="space-y-6 overflow-y-auto">
            <!-- Default sprites -->
            <div class="rounded-lg bg-white p-4 shadow-md">
              <h4 class="text-sm font-medium text-gray-700 mb-3 border-b pb-2">Default Sprites</h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div v-if="pokemon.sprites?.front_default" class="relative group">
                  <div class="bg-gray-50 rounded-lg p-3 flex flex-col items-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                    <img :src="pokemon.sprites.front_default" alt="Front Default" class="h-20 w-20 object-contain" />
                    <span class="text-xs text-gray-500 mt-2">Front</span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center p-2">
                    <a :href="pokemon.sprites.front_default" target="_blank" class="text-xs text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded">View Full</a>
                  </div>
                </div>
                
                <div v-if="pokemon.sprites?.back_default" class="relative group">
                  <div class="bg-gray-50 rounded-lg p-3 flex flex-col items-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                    <img :src="pokemon.sprites.back_default" alt="Back Default" class="h-20 w-20 object-contain" />
                    <span class="text-xs text-gray-500 mt-2">Back</span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center p-2">
                    <a :href="pokemon.sprites.back_default" target="_blank" class="text-xs text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded">View Full</a>
                  </div>
                </div>
                
                <div v-if="pokemon.sprites?.front_female" class="relative group">
                  <div class="bg-gray-50 rounded-lg p-3 flex flex-col items-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                    <img :src="pokemon.sprites.front_female" alt="Front Female" class="h-20 w-20 object-contain" />
                    <span class="text-xs text-gray-500 mt-2">Female</span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center p-2">
                    <a :href="pokemon.sprites.front_female" target="_blank" class="text-xs text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded">View Full</a>
                  </div>
                </div>
                
                <div v-if="pokemon.sprites?.back_female" class="relative group">
                  <div class="bg-gray-50 rounded-lg p-3 flex flex-col items-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                    <img :src="pokemon.sprites.back_female" alt="Back Female" class="h-20 w-20 object-contain" />
                    <span class="text-xs text-gray-500 mt-2">Female Back</span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center p-2">
                    <a :href="pokemon.sprites.back_female" target="_blank" class="text-xs text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded">View Full</a>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Shiny sprites -->
            <div class="rounded-lg bg-white p-4 shadow-md">
              <h4 class="text-sm font-medium text-gray-700 mb-3 border-b pb-2 flex items-center">
                <span class="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                Shiny Variants
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div v-if="pokemon.sprites?.front_shiny" class="relative group">
                  <div class="bg-gradient-to-b from-yellow-50 to-gray-50 rounded-lg p-3 flex flex-col items-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                    <img :src="pokemon.sprites.front_shiny" alt="Front Shiny" class="h-20 w-20 object-contain" />
                    <span class="text-xs text-gray-500 mt-2">Shiny Front</span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center p-2">
                    <a :href="pokemon.sprites.front_shiny" target="_blank" class="text-xs text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded">View Full</a>
                  </div>
                </div>
                
                <div v-if="pokemon.sprites?.back_shiny" class="relative group">
                  <div class="bg-gradient-to-b from-yellow-50 to-gray-50 rounded-lg p-3 flex flex-col items-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                    <img :src="pokemon.sprites.back_shiny" alt="Back Shiny" class="h-20 w-20 object-contain" />
                    <span class="text-xs text-gray-500 mt-2">Shiny Back</span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center p-2">
                    <a :href="pokemon.sprites.back_shiny" target="_blank" class="text-xs text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded">View Full</a>
                  </div>
                </div>
                
                <div v-if="pokemon.sprites?.front_shiny_female" class="relative group">
                  <div class="bg-gradient-to-b from-yellow-50 to-gray-50 rounded-lg p-3 flex flex-col items-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                    <img :src="pokemon.sprites.front_shiny_female" alt="Front Shiny Female" class="h-20 w-20 object-contain" />
                    <span class="text-xs text-gray-500 mt-2">Shiny Female</span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center p-2">
                    <a :href="pokemon.sprites.front_shiny_female" target="_blank" class="text-xs text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded">View Full</a>
                  </div>
                </div>
                
                <div v-if="pokemon.sprites?.back_shiny_female" class="relative group">
                  <div class="bg-gradient-to-b from-yellow-50 to-gray-50 rounded-lg p-3 flex flex-col items-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                    <img :src="pokemon.sprites.back_shiny_female" alt="Back Shiny Female" class="h-20 w-20 object-contain" />
                    <span class="text-xs text-gray-500 mt-2">Shiny Female Back</span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center p-2">
                    <a :href="pokemon.sprites.back_shiny_female" target="_blank" class="text-xs text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded">View Full</a>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- No sprites message -->
            <div v-if="!hasSomeSprites" class="text-center py-6 text-gray-500">
              No sprite images available for this Pokemon
            </div>
          </div>
        </div>
        
        <!-- Moves tab - Redesigned -->
        <div v-else-if="activeTab === 'moves'" class="bg-gray-50 rounded-xl p-5 shadow-inner">
          <h3 class="text-lg font-semibold mb-4 text-gray-700 flex items-center sticky top-0 bg-gray-50 z-10 pb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            Moves <span class="ml-1 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">{{ pokemon.moves?.length || 0 }}</span>
          </h3>
          
          <!-- Search and Filter for moves -->
          <div class="mb-5 bg-white rounded-lg shadow-sm p-3 sticky top-14 z-10">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input 
                v-model="moveSearch" 
                type="text" 
                placeholder="Search moves..." 
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <!-- Method filter pills -->
            <div class="mt-3 flex flex-wrap gap-2 overflow-x-auto pb-1">
              <button
                @click="moveMethodFilter = ''"
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium transition-colors',
                  moveMethodFilter === '' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                ]"
              >
                All
              </button>
              <button
                v-for="method in availableMethods"
                :key="method"
                @click="moveMethodFilter = method"
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
                  moveMethodFilter === method 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                ]"
              >
                {{ method.replace('-', ' ') }}
              </button>
            </div>
          </div>
          
          <!-- Moves list -->
          <div 
            class="max-h-[60vh] overflow-y-auto pr-2 rounded-lg bg-white shadow-sm"
            v-if="filteredMoves.length > 0"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Move</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="(move, index) in filteredMoves" 
                  :key="index" 
                  class="hover:bg-gray-50 transition-colors cursor-pointer"
                  @click="showMoveDetails(move)"
                >
                  <td class="px-4 py-3 text-sm">
                    <div class="flex items-center">
                      <span 
                        class="w-2 h-2 rounded-full mr-2" 
                        :class="getMoveTypeColor(move)"
                      ></span>
                      <span class="font-medium capitalize">{{ move.move.name.replace('-', ' ') }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm">
                    <span 
                      class="capitalize px-2 py-0.5 rounded-md text-xs font-medium"
                      :class="getMethodClass(move.version_group_details[0]?.move_learn_method?.name)"
                    >
                      {{ move.version_group_details[0]?.move_learn_method?.name.replace('-', ' ') || 'Unknown' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ move.version_group_details[0]?.level_learned_at || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Empty state -->
          <div 
            v-else
            class="py-10 text-center bg-white rounded-lg shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="mt-4 text-gray-500">No moves found matching your search</p>
          </div>
        </div>
        
        <!-- Game Indices tab - Redesigned -->
        <div v-else-if="activeTab === 'games'" class="bg-gray-50 rounded-xl p-5 shadow-inner">
          <h3 class="text-lg font-semibold mb-5 text-gray-700 flex items-center sticky top-0 bg-gray-50 z-10 pb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
            </svg>
            Game Appearances
          </h3>
          
          <div v-if="pokemon.game_indices && pokemon.game_indices.length > 0" class="space-y-6 overflow-y-auto">
            <!-- Group games by generation -->
            <div v-for="(group, generation) in groupedGames" :key="generation" class="bg-white rounded-lg p-4 shadow-sm">
              <h4 class="text-sm font-medium text-gray-700 mb-3 pb-2 border-b">{{ generation }}</h4>
              
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <div 
                  v-for="(game, index) in group" 
                  :key="index" 
                  class="group transition-all duration-300 hover:scale-105 relative"
                >
                  <div 
                    class="px-3 py-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm text-sm capitalize flex flex-col"
                  >
                    <span class="font-medium text-gray-800">{{ game.version.name.replace('-', ' ') }}</span>
                    <span class="text-xs text-gray-500 mt-1">Index: #{{ game.game_index }}</span>
                    <span 
                      class="absolute top-0 right-0 transform translate-x-1 -translate-y-1 w-3 h-3 rounded-full group-hover:animate-ping"
                      :class="getGameColor(game.version.name)"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Game count summary -->
            <div class="bg-blue-50 rounded-lg p-4 text-center">
              <p class="text-sm text-blue-700">
                <span class="font-bold">{{ pokemon.game_indices.length }}</span> game appearances across 
                <span class="font-bold">{{ Object.keys(groupedGames).length }}</span> generations
              </p>
            </div>
          </div>
          
          <div v-else class="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="mt-4 text-gray-500">No game data available</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'

// Define props and emits
const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// Get store
const pokemonStore = usePokemonStore()
const { IMAGE_URL } = pokemonStore

// Tab state
const tabs = [
  { id: 'base', name: 'Info & Stats' },
  { id: 'sprites', name: 'Sprites' },
  { id: 'moves', name: 'Moves' },
  { id: 'games', name: 'Games' }
]
const activeTab = ref('base')
const moveSearch = ref('')
const moveMethodFilter = ref('')

// Computed properties
const primaryType = computed(() => {
  if (!props.pokemon?.types?.length) return 'normal'
  return props.pokemon.types[0].type.name
})

// Sprites-related computed
const hasSomeSprites = computed(() => {
  if (!props.pokemon.sprites) return false
  const sprites = props.pokemon.sprites
  return sprites.front_default || sprites.back_default || sprites.front_shiny || 
         sprites.back_shiny || sprites.front_female || sprites.back_female ||
         sprites.front_shiny_female || sprites.back_shiny_female ||
         (sprites.other && sprites.other['official-artwork'] && sprites.other['official-artwork'].front_default)
})

// Moves-related computed props
const availableMethods = computed(() => {
  if (!props.pokemon.moves) return []
  const methods = new Set()
  props.pokemon.moves.forEach(move => {
    if (move.version_group_details && move.version_group_details.length > 0) {
      const method = move.version_group_details[0]?.move_learn_method?.name
      if (method) methods.add(method)
    }
  })
  return Array.from(methods)
})

const filteredMoves = computed(() => {
  if (!props.pokemon.moves) return []
  
  // Apply search and method filters
  let filtered = props.pokemon.moves
  
  // Apply text search
  if (moveSearch.value) {
    filtered = filtered.filter(move => 
      move.move.name.toLowerCase().includes(moveSearch.value.toLowerCase())
    )
  }
  
  // Apply method filter
  if (moveMethodFilter.value) {
    filtered = filtered.filter(move => {
      if (!move.version_group_details || move.version_group_details.length === 0) return false
      return move.version_group_details[0]?.move_learn_method?.name === moveMethodFilter.value
    })
  }
  
  // Sort: First by method, then by level (for level-up moves)
  filtered = filtered.sort((a, b) => {
    const methodA = a.version_group_details[0]?.move_learn_method?.name || ''
    const methodB = b.version_group_details[0]?.move_learn_method?.name || ''
    
    // First sort by method
    if (methodA !== methodB) return methodA.localeCompare(methodB)
    
    // If both are level-up moves, sort by level
    if (methodA === 'level-up') {
      const levelA = a.version_group_details[0]?.level_learned_at || 0
      const levelB = b.version_group_details[0]?.level_learned_at || 0
      return levelA - levelB
    }
    
    // Otherwise sort by name
    return a.move.name.localeCompare(b.move.name)
  })
  
  // Limit results for performance
  return filtered.slice(0, 100)
})

// Game-related computed
const groupedGames = computed(() => {
  if (!props.pokemon.game_indices || props.pokemon.game_indices.length === 0) return {}
  
  const groups = {}
  
  // Map game versions to generations
  const gameGenerations = {
    // Gen 1
    'red': 'Generation I',
    'blue': 'Generation I',
    'yellow': 'Generation I',
    
    // Gen 2
    'gold': 'Generation II',
    'silver': 'Generation II',
    'crystal': 'Generation II',
    
    // Gen 3
    'ruby': 'Generation III',
    'sapphire': 'Generation III',
    'emerald': 'Generation III',
    'firered': 'Generation III',
    'leafgreen': 'Generation III',
    
    // Gen 4
    'diamond': 'Generation IV',
    'pearl': 'Generation IV',
    'platinum': 'Generation IV',
    'heartgold': 'Generation IV',
    'soulsilver': 'Generation IV',
    
    // Gen 5
    'black': 'Generation V',
    'white': 'Generation V',
    'black-2': 'Generation V',
    'white-2': 'Generation V',
    
    // Gen 6
    'x': 'Generation VI',
    'y': 'Generation VI',
    'omega-ruby': 'Generation VI',
    'alpha-sapphire': 'Generation VI',
    
    // Gen 7
    'sun': 'Generation VII',
    'moon': 'Generation VII',
    'ultra-sun': 'Generation VII',
    'ultra-moon': 'Generation VII',
    
    // Gen 8
    'sword': 'Generation VIII',
    'shield': 'Generation VIII'
  }
  
  // Group games by generation
  props.pokemon.game_indices.forEach(game => {
    const generation = gameGenerations[game.version.name] || 'Other Games'
    if (!groups[generation]) groups[generation] = []
    groups[generation].push(game)
  })
  
  return groups
})

// Methods
const closeModal = () => {
  emit('close')
}

const formatPokemonId = (id) => {
  return id.toString().padStart(3, '0')
}

const formatStatName = (name) => {
  // Format stat names for better display
  const statNames = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed'
  }

  return statNames[name] || name
}

const statColor = (name) => {
  // Color-coding for each stat
  const colors = {
    'hp': 'red',
    'attack': 'orange',
    'defense': 'yellow',
    'special-attack': 'blue',
    'special-defense': 'green',
    'speed': 'pink'
  }
  
  return colors[name] || 'gray'
}

const calculateStatRating = (total) => {
  if (total > 580) return 'Legendary Level'
  if (total > 530) return 'Pseudo-Legendary'
  if (total > 490) return 'Very Strong'
  if (total > 440) return 'Strong'
  if (total > 380) return 'Average'
  return 'Basic'
}

const getMethodClass = (method) => {
  if (!method) return 'bg-gray-100 text-gray-700'
  
  const classes = {
    'level-up': 'bg-green-100 text-green-800',
    'machine': 'bg-blue-100 text-blue-800',
    'egg': 'bg-purple-100 text-purple-800',
    'tutor': 'bg-yellow-100 text-yellow-800'
  }
  
  return classes[method] || 'bg-gray-100 text-gray-700'
}

const getGameColor = (game) => {
  // Color mapping for games
  const colors = {
    'red': 'bg-red-500',
    'blue': 'bg-blue-500',
    'yellow': 'bg-yellow-500',
    'gold': 'bg-yellow-400',
    'silver': 'bg-gray-400',
    'crystal': 'bg-blue-300',
    'ruby': 'bg-red-600',
    'sapphire': 'bg-blue-600',
    'emerald': 'bg-green-500',
    'firered': 'bg-red-500',
    'leafgreen': 'bg-green-400',
    'diamond': 'bg-blue-400',
    'pearl': 'bg-pink-300',
    'platinum': 'bg-gray-600',
    'black': 'bg-black',
    'white': 'bg-white border border-gray-400',
    'x': 'bg-blue-500',
    'y': 'bg-red-500',
    'sword': 'bg-blue-500',
    'shield': 'bg-red-600'
  }
  
  return colors[game] || 'bg-gray-400'
}

const getMoveTypeColor = (move) => {
  // This is a placeholder. In a real implementation, 
  // you would fetch the move type from an API or from cached data
  return 'bg-gray-400'
}

const showMoveDetails = (move) => {
  // This would show a modal or details about the selected move
  console.log('Move details:', move)
}

const getPokemonImage = (pokemon) => {
  // Try to get official artwork first
  if (pokemon.sprites?.other?.['official-artwork']?.front_default) {
    return pokemon.sprites.other['official-artwork'].front_default
  }

  // Fall back to regular sprite
  if (pokemon.sprites?.front_default) {
    return pokemon.sprites.front_default
  }

  // Last resort, use the ID to construct URL
  return `${IMAGE_URL}${pokemon.id}.png`
}

const calculateTotalStats = () => {
  return props.pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)
}
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

/* Type gradient colors */
.bg-normal-light { background-color: #C6C6A7; }
.bg-normal-dark { background-color: #A8A878; }
.bg-normal-main { background-color: #A8A878; }

.bg-fire-light { background-color: #F5AC78; }
.bg-fire-dark { background-color: #F08030; }
.bg-fire-main { background-color: #F08030; }

.bg-water-light { background-color: #98D8D8; }
.bg-water-dark { background-color: #6890F0; }
.bg-water-main { background-color: #6890F0; }

.bg-grass-light { background-color: #A7DB8D; }
.bg-grass-dark { background-color: #78C850; }
.bg-grass-main { background-color: #78C850; }

.bg-electric-light { background-color: #FAE078; }
.bg-electric-dark { background-color: #F8D030; }
.bg-electric-main { background-color: #F8D030; }

.bg-ice-light { background-color: #BCE6E6; }
.bg-ice-dark { background-color: #98D8D8; }
.bg-ice-main { background-color: #98D8D8; }

.bg-fighting-light { background-color: #D67873; }
.bg-fighting-dark { background-color: #C03028; }
.bg-fighting-main { background-color: #C03028; }

.bg-poison-light { background-color: #C183C1; }
.bg-poison-dark { background-color: #A040A0; }
.bg-poison-main { background-color: #A040A0; }

.bg-ground-light { background-color: #EBD69D; }
.bg-ground-dark { background-color: #E0C068; }
.bg-ground-main { background-color: #E0C068; }

.bg-flying-light { background-color: #C6B7F5; }
.bg-flying-dark { background-color: #A890F0; }
.bg-flying-main { background-color: #A890F0; }

.bg-psychic-light { background-color: #FA92B2; }
.bg-psychic-dark { background-color: #F85888; }
.bg-psychic-main { background-color: #F85888; }

.bg-bug-light { background-color: #C6D16E; }
.bg-bug-dark { background-color: #A8B820; }
.bg-bug-main { background-color: #A8B820; }

.bg-rock-light { background-color: #D1C17D; }
.bg-rock-dark { background-color: #B8A038; }
.bg-rock-main { background-color: #B8A038; }

.bg-ghost-light { background-color: #A292BC; }
.bg-ghost-dark { background-color: #705898; }
.bg-ghost-main { background-color: #705898; }

.bg-dragon-light { background-color: #A27DFA; }
.bg-dragon-dark { background-color: #7038F8; }
.bg-dragon-main { background-color: #7038F8; }

.bg-dark-light { background-color: #A29288; }
.bg-dark-dark { background-color: #705848; }
.bg-dark-main { background-color: #705848; }

.bg-steel-light { background-color: #D1D1E0; }
.bg-steel-dark { background-color: #B8B8D0; }
.bg-steel-main { background-color: #B8B8D0; }

.bg-fairy-light { background-color: #F4BDC9; }
.bg-fairy-dark { background-color: #EE99AC; }
.bg-fairy-main { background-color: #EE99AC; }

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-grow-stat {
  animation: growStat 1s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes growStat {
  from { width: 0; }
  to { /* width defined inline */ }
}

@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Smooth scrolling */
* {
  scroll-behavior: smooth;
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}
</style>
