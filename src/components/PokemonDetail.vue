<template>
  <div 
    class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    @click="closeModal"
    v-if="show"
  >
    <div 
      class="bg-white dark:bg-primary-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transform transition-all animate-scale-in"
      @click.stop
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        <p class="mt-4 text-gray-500 dark:text-gray-400">Loading details...</p>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="absolute top-4 right-4 flex items-center gap-3 z-20">
          <button 
            @click="pokemonStore.toggleFavorite(pokemon)"
            class="p-2 rounded-full bg-gray-200/50 dark:bg-black/20 hover:bg-gray-300/50 dark:hover:bg-black/40 transition-colors backdrop-blur-md text-gray-900 dark:text-white cursor-pointer"
            :class="{ 'text-red-500 dark:text-red-500': pokemonStore.isFavorite(pokemon.id) }"
            aria-label="Favorite"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :fill="pokemonStore.isFavorite(pokemon.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button 
            @click="handleDetailCatch"
            class="p-2 rounded-full bg-gray-200/50 dark:bg-black/20 hover:bg-gray-300/50 dark:hover:bg-black/40 transition-all backdrop-blur-md relative overflow-visible cursor-pointer"
            :class="[
              pokemon.isCaught ? 'text-accent' : 'text-gray-900 dark:text-white',
              { 'detail-catch-animating': isDetailCatching, 'detail-catch-success': showDetailCatchSuccess }
            ]"
            aria-label="Catch"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform" :class="{ 'animate-detail-wobble': isDetailCatching }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
              <line x1="12" y1="22" x2="12" y2="15"/>
              <line x1="12" y1="9" x2="12" y2="2"/>
            </svg>
            <!-- Sparkle particles -->
            <div v-if="showDetailCatchSuccess" class="detail-catch-particles">
              <span v-for="i in 6" :key="i" class="detail-sparkle" :style="getDetailSparkleStyle(i)"></span>
            </div>
          </button>
          <button 
            @click="closeModal"
            class="p-2 rounded-full bg-gray-200/50 dark:bg-black/20 hover:bg-gray-300/50 dark:hover:bg-black/40 transition-colors backdrop-blur-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Image Area -->
        <div class="relative bg-gray-100 dark:bg-primary-800/50 pt-12 pb-6 px-6 flex flex-col items-center rounded-t-2xl overflow-hidden">
          <div class="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <img 
            :src="getPokemonImage(pokemon)" 
            :alt="pokemon.name"
            class="w-48 h-48 object-contain relative z-10 drop-shadow-2xl filter"
            @error="handleImageError"
          />
          
          <div class="mt-4 text-center relative z-10">
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-widest">#{{ formatId(pokemon.id) }}</p>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white capitalize mt-1">{{ pokemon.name }}</h2>
            
            <div class="flex gap-2 justify-center mt-3">
              <span 
                v-for="type in pokemon.types" 
                :key="type.type.name"
                class="px-3 py-1 rounded-full text-xs font-semibold text-white capitalize shadow-md"
                :style="{ backgroundColor: getTypeColor(type.type.name) }"
              >
                {{ type.type.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-6">
          <!-- Tabs -->
          <div class="flex p-1 bg-gray-100 dark:bg-primary-800 rounded-lg mb-6">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer"
              :class="activeTab === tab.id ? 'bg-accent text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab Contents -->
          <div class="min-h-[250px]">
            
            <!-- Info Tab -->
            <div v-show="activeTab === 'info'" class="space-y-6 animate-fade-in">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 dark:bg-primary-800/50 p-4 rounded-xl border border-gray-200 dark:border-primary-700/50">
                  <p class="text-gray-500 dark:text-gray-400 text-xs mb-1">Height</p>
                  <p class="text-gray-900 dark:text-white font-semibold">{{ pokemon.height != null ? (pokemon.height / 10).toFixed(1) + ' m' : '—' }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-primary-800/50 p-4 rounded-xl border border-gray-200 dark:border-primary-700/50">
                  <p class="text-gray-500 dark:text-gray-400 text-xs mb-1">Weight</p>
                  <p class="text-gray-900 dark:text-white font-semibold">{{ pokemon.weight != null ? (pokemon.weight / 10).toFixed(1) + ' kg' : '—' }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-primary-800/50 p-4 rounded-xl border border-gray-200 dark:border-primary-700/50">
                  <p class="text-gray-500 dark:text-gray-400 text-xs mb-1">Base Exp</p>
                  <p class="text-gray-900 dark:text-white font-semibold">{{ pokemon.base_experience ?? '—' }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-primary-800/50 p-4 rounded-xl border border-gray-200 dark:border-primary-700/50">
                  <p class="text-gray-500 dark:text-gray-400 text-xs mb-1">Abilities</p>
                  <div class="flex flex-col gap-1">
                    <span 
                      v-for="ability in (pokemon.abilities || [])" 
                      :key="ability.ability.name"
                      class="text-gray-900 dark:text-white text-sm capitalize flex items-center gap-1"
                    >
                      {{ ability.ability.name.replace('-', ' ') }}
                      <span v-if="ability.is_hidden" class="text-[10px] bg-gray-200 dark:bg-primary-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded ml-1">HA</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats Tab -->
            <div v-show="activeTab === 'stats'" class="space-y-4 animate-fade-in">
              <template v-if="pokemon.stats && pokemon.stats.length">
              <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="flex items-center gap-3">
                <div class="w-16 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ formatStatName(stat.stat.name) }}
                </div>
                <div class="w-8 text-right text-sm font-bold text-gray-900 dark:text-white">
                  {{ stat.base_stat ?? '—' }}
                </div>
                <div class="flex-1 h-2 bg-gray-100 dark:bg-primary-800 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-1000 ease-out"
                    :class="getStatColorClass(stat.base_stat)"
                    :style="{ width: `${Math.min(100, ((stat.base_stat || 0) / 255) * 100)}%` }"
                  ></div>
                </div>
              </div>
              <div class="pt-2 mt-2 border-t border-gray-200 dark:border-primary-800 flex items-center gap-3">
                <div class="w-16 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Total</div>
                <div class="w-8 text-right text-sm font-bold text-accent">{{ totalStats }}</div>
                <div class="flex-1"></div>
              </div>
              </template>
              <div v-else class="text-center text-gray-500 py-12 text-sm">
                Loading stats...
              </div>
            </div>

            <!-- Moves Tab -->
            <div v-show="activeTab === 'moves'" class="animate-fade-in flex flex-col h-[250px]">
              <div class="relative mb-3">
                <input 
                  v-model="moveSearch" 
                  type="text" 
                  placeholder="Search moves..." 
                  class="w-full bg-gray-50 dark:bg-primary-800 border border-gray-200 dark:border-primary-700 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-accent"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div class="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                <template v-if="filteredMoves.length">
                  <div 
                    v-for="move in filteredMoves" 
                    :key="move.move.name"
                    class="bg-gray-50 dark:bg-primary-800/40 border border-gray-200 dark:border-primary-700/50 p-3 rounded-lg flex justify-between items-center"
                  >
                    <span class="text-gray-900 dark:text-white text-sm capitalize font-medium">{{ move.move.name.replace('-', ' ') }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-primary-900 px-2 py-1 rounded capitalize">
                      {{ move.version_group_details[0]?.move_learn_method?.name.replace('-', ' ') || 'Unknown' }}
                    </span>
                  </div>
                </template>
                <div v-else class="text-center text-gray-500 py-8 text-sm">
                  No moves found
                </div>
              </div>
            </div>

            <!-- Sprites Tab -->
            <div v-show="activeTab === 'sprites'" class="animate-fade-in">
              <div v-if="hasSprites" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div v-if="pokemon.sprites?.front_default" class="bg-gray-50 dark:bg-primary-800/40 border border-gray-200 dark:border-primary-700/50 rounded-xl p-3 flex flex-col items-center">
                  <img :src="pokemon.sprites.front_default" alt="Front" class="w-16 h-16 object-contain pixelated">
                  <span class="text-[10px] text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-wider">Default</span>
                </div>
                <div v-if="pokemon.sprites?.back_default" class="bg-gray-50 dark:bg-primary-800/40 border border-gray-200 dark:border-primary-700/50 rounded-xl p-3 flex flex-col items-center">
                  <img :src="pokemon.sprites.back_default" alt="Back" class="w-16 h-16 object-contain pixelated">
                  <span class="text-[10px] text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-wider">Back</span>
                </div>
                <div v-if="pokemon.sprites?.front_shiny" class="bg-gray-50 dark:bg-primary-800/40 border border-gray-200 dark:border-primary-700/50 rounded-xl p-3 flex flex-col items-center">
                  <img :src="pokemon.sprites.front_shiny" alt="Shiny" class="w-16 h-16 object-contain pixelated">
                  <span class="text-[10px] text-accent mt-2 uppercase tracking-wider">Shiny</span>
                </div>
                <div v-if="pokemon.sprites?.back_shiny" class="bg-gray-50 dark:bg-primary-800/40 border border-gray-200 dark:border-primary-700/50 rounded-xl p-3 flex flex-col items-center">
                  <img :src="pokemon.sprites.back_shiny" alt="Shiny Back" class="w-16 h-16 object-contain pixelated">
                  <span class="text-[10px] text-accent mt-2 uppercase tracking-wider">Shiny Back</span>
                </div>
              </div>
              <div v-else class="text-center text-gray-500 py-12 text-sm">
                No sprites available
              </div>
            </div>
            
            <!-- Games Tab -->
            <div v-show="activeTab === 'games'" class="animate-fade-in flex flex-col h-[250px]">
               <div v-if="pokemon.game_indices?.length" class="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                  <div 
                    v-for="game in pokemon.game_indices" 
                    :key="game.version.name"
                    class="bg-gray-50 dark:bg-primary-800/40 border border-gray-200 dark:border-primary-700/50 p-3 rounded-lg flex justify-between items-center"
                  >
                    <span class="text-gray-900 dark:text-white text-sm capitalize font-medium">{{ game.version.name.replace('-', ' ') }}</span>
                    <span class="text-xs text-gray-500 font-mono">
                      #{{ game.game_index }}
                    </span>
                  </div>
               </div>
               <div v-else class="text-center text-gray-500 py-12 text-sm">
                 No game data available
               </div>
            </div>

          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])
const pokemonStore = usePokemonStore()

// State
const isLoading = ref(true)
const activeTab = ref('info')
const isDetailCatching = ref(false)
const showDetailCatchSuccess = ref(false)
const moveSearch = ref('')

const tabs = [
  { id: 'info', label: 'Info' },
  { id: 'stats', label: 'Stats' },
  { id: 'moves', label: 'Moves' },
  { id: 'sprites', label: 'Sprites' },
  { id: 'games', label: 'Games' }
]

// Simulate loading for smooth transition
watch(() => props.pokemon?.id, () => {
  if (props.pokemon) {
    isLoading.value = true
    setTimeout(() => {
      isLoading.value = false
    }, 300)
    activeTab.value = 'info'
    moveSearch.value = ''
  }
}, { immediate: true })

// Keydown listener for escape
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.show) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Methods
const closeModal = () => {
  emit('close')
}

const handleDetailCatch = () => {
  if (isDetailCatching.value) return
  
  const wasCaught = props.pokemon.isCaught
  if (wasCaught) {
    // Simple release
    pokemonStore.toggleCatch(props.pokemon)
    return
  }

  // Animate catch
  isDetailCatching.value = true
  setTimeout(() => {
    pokemonStore.toggleCatch(props.pokemon)
    showDetailCatchSuccess.value = true
    isDetailCatching.value = false
    setTimeout(() => {
      showDetailCatchSuccess.value = false
    }, 800)
  }, 600)
}

const getDetailSparkleStyle = (index) => {
  const angle = (index - 1) * 60
  const distance = 20 + Math.random() * 10
  const delay = Math.random() * 0.1
  const size = 3 + Math.random() * 3
  return {
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    '--delay': `${delay}s`,
    '--size': `${size}px`,
  }
}

const formatId = (id) => {
  if (id == null) return '???'
  return String(id).padStart(3, '0')
}

const getPokemonImage = (poke) => {
  if (poke.sprites?.other?.['official-artwork']?.front_default) {
    return poke.sprites.other['official-artwork'].front_default
  }
  return poke.sprites?.front_default || ''
}

const handleImageError = (e) => {
  e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
}

// Type Colors Map (matching tailwind config logic if needed, fallback to hex)
const typeColors = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD'
}

const getTypeColor = (type) => {
  return typeColors[type] || '#A8A77A'
}

// Stats Formatting
const formatStatName = (name) => {
  const map = {
    'hp': 'HP', 'attack': 'ATK', 'defense': 'DEF',
    'special-attack': 'SpA', 'special-defense': 'SpD', 'speed': 'SPD'
  }
  return map[name] || name
}

const getStatColorClass = (val) => {
  if (val < 50) return 'bg-red-500'
  if (val < 80) return 'bg-orange-400'
  if (val < 100) return 'bg-yellow-400'
  return 'bg-green-500'
}

const totalStats = computed(() => {
  return props.pokemon?.stats?.reduce((acc, stat) => acc + stat.base_stat, 0) || 0
})

// Moves
const filteredMoves = computed(() => {
  if (!props.pokemon?.moves) return []
  const query = moveSearch.value.toLowerCase()
  let moves = props.pokemon.moves
  
  if (query) {
    moves = moves.filter(m => m.move.name.toLowerCase().includes(query))
  }
  return moves.slice(0, 50) // Limit for performance
})

// Sprites
const hasSprites = computed(() => {
  const s = props.pokemon?.sprites
  return s && (s.front_default || s.back_default || s.front_shiny || s.back_shiny)
})

</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.pixelated {
  image-rendering: pixelated;
}

/* Custom Scrollbar for inner content */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; /* slate-300 */
  border-radius: 4px;
}
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb,
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151; /* gray-700 */
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; /* slate-400 */
}
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover,
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4B5563; /* gray-600 */
}
</style>

<style scoped>
/* Detail Catch Animation */
.animate-detail-wobble {
  animation: detailWobble 0.6s ease-in-out;
}

.detail-catch-success {
  animation: detailCatchPulse 0.5s ease-out;
}

.detail-catch-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  z-index: 30;
  pointer-events: none;
}

.detail-sparkle {
  position: absolute;
  width: var(--size, 4px);
  height: var(--size, 4px);
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 6px #fbbf24;
  animation: detailSparkleExplode 0.6s ease-out var(--delay, 0s) forwards;
  transform: translate(-50%, -50%);
}

.detail-sparkle:nth-child(odd) {
  background: #34d399;
  box-shadow: 0 0 6px #34d399;
}

.detail-sparkle:nth-child(3n) {
  background: #818cf8;
  box-shadow: 0 0 6px #818cf8;
}

@keyframes detailWobble {
  0% { transform: rotate(0deg) scale(1); }
  15% { transform: rotate(0deg) scale(1.25); }
  30% { transform: rotate(-20deg) scale(1.2); }
  50% { transform: rotate(20deg) scale(1.15); }
  70% { transform: rotate(-10deg) scale(1.1); }
  85% { transform: rotate(5deg) scale(1.05); }
  100% { transform: rotate(0deg) scale(1); }
}

@keyframes detailCatchPulse {
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.6); }
  50% { box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}

@keyframes detailSparkleExplode {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateY(0) scale(0);
    opacity: 1;
  }
  40% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateY(calc(var(--distance, 20px) * -0.7)) scale(1.3);
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateY(calc(var(--distance, 20px) * -1)) scale(0);
    opacity: 0;
  }
}
</style>
