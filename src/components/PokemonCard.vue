<template>
  <div
    class="pokemon-card group"
    @click="viewDetails"
  >
    <!-- Background Gradient based on primary type -->
    <div class="pokemon-card-bg" :class="`bg-pokemon-${primaryType}`"></div>
    <div class="pokemon-card-bg-overlay"></div>

    <!-- Top Action Bar -->
    <div class="pokemon-card-actions">
      <!-- Favorite Button -->
      <button 
        @click.stop="toggleFavorite"
        class="action-btn favorite-btn"
        :class="{ 'is-active': pokemon.isFavorite }"
        aria-label="Toggle Favorite"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="heart-icon"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>

      <!-- Catch Button -->
      <button 
        @click.stop="handleCatchClick"
        class="action-btn catch-btn"
        :class="{ 'is-caught': pokemon.isCaught, 'is-animating': isCatching, 'is-releasing': isReleasing, 'catch-success': showCatchSuccess }"
        aria-label="Catch Pokemon"
      >
        <div class="pokeball-icon">
          <div class="pokeball-top"></div>
          <div class="pokeball-bottom"></div>
          <div class="pokeball-center"></div>
        </div>
        <!-- Catch sparkle particles -->
        <div v-if="showCatchSuccess" class="catch-particles">
          <span v-for="i in 8" :key="i" class="sparkle" :style="getSparkleStyle(i)"></span>
        </div>
      </button>
    </div>

    <!-- Catch Success Overlay -->
    <Transition name="catch-flash">
      <div v-if="showCatchSuccess" class="catch-overlay">
        <span class="catch-text">Gotcha!</span>
      </div>
    </Transition>
    <!-- Image Container -->
    <div class="pokemon-image-container">
      <LazyImage
        :src="pokemonImage"
        :alt="pokemon.name"
        imgClass="pokemon-image"
        :fallbackSrc="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id || '0'}.png`"
      />
    </div>

    <!-- Content -->
    <div class="pokemon-card-content">
      <!-- ID -->
      <div class="pokemon-id">
        #{{ formatId(pokemon.id) }}
      </div>

      <!-- Name -->
      <h3 class="pokemon-name">
        {{ pokemon.name || 'Unknown' }}
      </h3>

      <!-- Types -->
      <div class="pokemon-types">
        <span 
          v-for="typeObj in pokemon.types" 
          :key="typeObj.type.name"
          class="type-badge"
          :class="`bg-pokemon-${typeObj.type.name}`"
        >
          {{ typeObj.type.name }}
        </span>
      </div>

      <!-- Stats Preview (HP) -->
      <div class="pokemon-stats" v-if="hpStat">
        <div class="stat-header">
          <span class="stat-label">HP</span>
          <span class="stat-value">{{ hpStat }}</span>
        </div>
        <div class="stat-bar-bg">
          <div 
            class="stat-bar-fill" 
            :style="{ width: `${Math.min((hpStat / 255) * 100, 100)}%` }"
            :class="`bg-pokemon-${primaryType}`"
          ></div>
        </div>
      </div>
      
      <!-- Footer Action -->
      <div class="pokemon-card-footer">
        <span class="view-details-text">View Details</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import LazyImage from './LazyImage.vue'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select-pokemon', 'view-details', 'toggle-catch'])

const pokemonStore = usePokemonStore()
const isCatching = ref(false)
const isReleasing = ref(false)
const showCatchSuccess = ref(false)

// Computed Properties
const primaryType = computed(() => {
  if (!props.pokemon.types || props.pokemon.types.length === 0) return 'normal'
  return props.pokemon.types[0].type?.name || 'normal'
})

const pokemonImage = computed(() => {
  const p = props.pokemon
  if (p.sprites?.other?.['official-artwork']?.front_default) {
    return p.sprites.other['official-artwork'].front_default
  }
  if (p.sprites?.front_default) {
    return p.sprites.front_default
  }
  const id = p.id || '1'
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
})

const hpStat = computed(() => {
  if (props.pokemon.stats && props.pokemon.stats.length > 0) {
    const hp = props.pokemon.stats.find(stat => stat.stat?.name === 'hp')
    if (hp) return hp.base_stat
  }
  // Fallback
  if (props.pokemon.id) {
    const id = typeof props.pokemon.id === 'string' ? parseInt(props.pokemon.id, 10) : props.pokemon.id
    return Math.min(150, 50 + (id % 100))
  }
  return 70
})

// Methods
const formatId = (id) => {
  if (!id) return '???'
  return id.toString().padStart(3, '0')
}

const viewDetails = () => {
  emit('select-pokemon', props.pokemon)
  emit('view-details', props.pokemon)
}

const toggleFavorite = () => {
  if (pokemonStore.toggleFavorite) {
    pokemonStore.toggleFavorite(props.pokemon)
  }
}

const getSparkleStyle = (index) => {
  const angle = (index - 1) * 45 // 8 sparkles evenly spaced
  const distance = 18 + Math.random() * 8
  const delay = Math.random() * 0.15
  const size = 3 + Math.random() * 3
  return {
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    '--delay': `${delay}s`,
    '--size': `${size}px`,
  }
}

const handleCatchClick = () => {
  if (isCatching.value || isReleasing.value) return

  const wasCaught = props.pokemon.isCaught

  if (wasCaught) {
    // Release animation (simple)
    isReleasing.value = true
    setTimeout(() => {
      if (pokemonStore.toggleCatch) {
        pokemonStore.toggleCatch(props.pokemon)
      }
      isReleasing.value = false
    }, 400)
    return
  }

  // Catch animation: wobble → click → sparkle burst → success
  isCatching.value = true

  // After wobble completes (800ms), trigger catch + sparkles
  setTimeout(() => {
    if (pokemonStore.toggleCatch) {
      pokemonStore.toggleCatch(props.pokemon)
    }
    showCatchSuccess.value = true
    isCatching.value = false

    // Clear success state after particles finish
    setTimeout(() => {
      showCatchSuccess.value = false
    }, 900)
  }, 800)
}
</script>

<style scoped>
/* 
  Modern clean design using CSS variables where possible.
  Type colors are dynamically mapped via tailwind classes (bg-pokemon-*) 
  but we'll define fallbacks in CSS just in case they aren't configured perfectly.
*/

.pokemon-card {
  position: relative;
  width: 100%;
  border-radius: 1rem;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

:deep(.dark) .pokemon-card,
.dark .pokemon-card {
  background-color: #1e293b; /* surface-card */
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.pokemon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -5px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.1);
}

:deep(.dark) .pokemon-card:hover,
.dark .pokemon-card:hover {
  box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

/* Background Effects */
.pokemon-card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 140px;
  opacity: 0.15;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.pokemon-card:hover .pokemon-card-bg {
  opacity: 0.25;
}

.pokemon-card-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 140px;
  background: linear-gradient(to bottom, transparent 0%, #ffffff 100%);
  z-index: 1;
}

:deep(.dark) .pokemon-card-bg-overlay,
.dark .pokemon-card-bg-overlay {
  background: linear-gradient(to bottom, transparent 0%, #1e293b 100%);
}

/* Action Buttons */
.pokemon-card-actions {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  right: 0.75rem;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.dark) .action-btn,
.dark .action-btn {
  background-color: rgba(15, 23, 42, 0.5); /* darker surface */
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8; /* slate-400 */
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
  color: #0f172a;
}

:deep(.dark) .action-btn:hover,
.dark .action-btn:hover {
  background-color: rgba(15, 23, 42, 0.8);
  color: #f8fafc;
}


/* Favorite Heart */
.heart-icon {
  width: 1.125rem;
  height: 1.125rem;
  transition: all 0.2s ease;
}

.favorite-btn.is-active {
  color: #ef4444; /* red-500 */
}

.favorite-btn.is-active .heart-icon {
  fill: currentColor;
}

/* Catch Pokeball */
.pokeball-icon {
  width: 1.25rem;
  height: 1.25rem;
  position: relative;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  overflow: hidden;
  transition: all 0.3s ease;
}

.pokeball-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background-color: transparent;
  border-bottom: 1.5px solid currentColor;
  transition: background-color 0.3s ease;
}

.pokeball-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1.5px solid currentColor;
  z-index: 2;
  transition: background-color 0.3s ease;
}

:deep(.dark) .pokeball-center,
.dark .pokeball-center {
  background-color: #1e293b;
}

.catch-btn.is-caught {
  color: #10b981; /* emerald-500 */
  border-color: rgba(16, 185, 129, 0.3);
  background-color: rgba(16, 185, 129, 0.15);
}

:deep(.dark) .catch-btn.is-caught,
.dark .catch-btn.is-caught {
  color: #34d399; /* emerald-400, brighter for dark bg */
  border-color: rgba(52, 211, 153, 0.3);
  background-color: rgba(52, 211, 153, 0.15);
}

.catch-btn.is-caught .pokeball-top {
  background-color: currentColor;
}

.catch-btn.is-caught .pokeball-center {
  background-color: currentColor;
}

/* Release animation */
.catch-btn.is-releasing {
  animation: releaseShake 0.4s ease-in-out;
}

.catch-btn.is-releasing .pokeball-icon {
  animation: pokeballOpen 0.4s ease-out;
}

/* Catch success flash on the button */
.catch-btn.catch-success {
  animation: catchPulse 0.5s ease-out;
  color: #10b981;
}

/* Pokeball wobble animation - 3 shakes like the games */
.catch-btn.is-animating .pokeball-icon {
  animation: pokeballWobble 0.8s ease-in-out;
}

/* Sparkle burst particles */
.catch-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  z-index: 20;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: var(--size, 4px);
  height: var(--size, 4px);
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 4px #fbbf24, 0 0 8px rgba(251, 191, 36, 0.5);
  animation: sparkleExplode 0.7s ease-out var(--delay, 0s) forwards;
  transform: translate(-50%, -50%);
}

.sparkle:nth-child(odd) {
  background: #34d399;
  box-shadow: 0 0 4px #34d399, 0 0 8px rgba(52, 211, 153, 0.5);
}

.sparkle:nth-child(3n) {
  background: #60a5fa;
  box-shadow: 0 0 4px #60a5fa, 0 0 8px rgba(96, 165, 250, 0.5);
}

/* Catch overlay */
.catch-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15;
  pointer-events: none;
  border-radius: 1rem;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
}

.catch-text {
  font-size: 1.1rem;
  font-weight: 800;
  color: #10b981;
  text-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: catchTextPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  letter-spacing: 0.05em;
}

/* Transition for catch flash overlay */
.catch-flash-enter-active {
  transition: opacity 0.15s ease-out;
}
.catch-flash-leave-active {
  transition: opacity 0.4s ease-in 0.5s;
}
.catch-flash-enter-from,
.catch-flash-leave-to {
  opacity: 0;
}

/* === Keyframes === */

@keyframes pokeballWobble {
  0% { transform: rotate(0deg) scale(1); }
  10% { transform: rotate(0deg) scale(1.2); }
  20% { transform: rotate(-25deg) scale(1.2); }
  35% { transform: rotate(25deg) scale(1.15); }
  50% { transform: rotate(-15deg) scale(1.1); }
  65% { transform: rotate(10deg) scale(1.05); }
  80% { transform: rotate(-5deg) scale(1); }
  90% { transform: rotate(0deg) scale(0.95); }
  100% { transform: rotate(0deg) scale(1); }
}

@keyframes sparkleExplode {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateY(0) scale(0);
    opacity: 1;
  }
  30% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateY(calc(var(--distance, 20px) * -0.6)) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateY(calc(var(--distance, 20px) * -1)) scale(0);
    opacity: 0;
  }
}

@keyframes catchTextPop {
  0% {
    transform: scale(0) translateY(10px);
    opacity: 0;
  }
  40% {
    transform: scale(1.3) translateY(-5px);
    opacity: 1;
  }
  60% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  100% {
    transform: scale(0.9) translateY(-2px);
    opacity: 0;
  }
}

@keyframes catchPulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
  50% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

@keyframes releaseShake {
  0% { transform: scale(1); }
  30% { transform: scale(0.9); }
  60% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes pokeballOpen {
  0% { transform: rotate(0); }
  40% { transform: rotate(10deg) scale(1.1); }
  100% { transform: rotate(0) scale(1); }
}

/* Image Container */
.pokemon-image-container {
  position: relative;
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
  z-index: 2;
}

/* This targets the LazyImage inner img if possible, otherwise relies on imgClass */
:deep(.pokemon-image) {
  width: 110px;
  height: 110px;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pokemon-card:hover :deep(.pokemon-image) {
  transform: scale(1.15) translateY(-5px);
}

/* Content Area */
.pokemon-card-content {
  padding: 0.5rem 1.25rem 1.25rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.pokemon-id {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b; /* slate-500 */
  margin-bottom: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

:deep(.dark) .pokemon-id,
.dark .pokemon-id {
  color: #94a3b8;
}

.pokemon-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a; /* slate-900 */
  margin: 0 0 0.75rem 0;
  text-transform: capitalize;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

:deep(.dark) .pokemon-name,
.dark .pokemon-name {
  color: #f8fafc; /* slate-50 */
}


.pokemon-types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.type-badge {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Stats */
.pokemon-stats {
  margin-top: auto;
  margin-bottom: 1rem;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.dark) .stat-label,
.dark .stat-label {
  color: #94a3b8;
}

.stat-value {
  font-size: 0.8rem;
  font-weight: 700;
  color: #334155;
}

:deep(.dark) .stat-value,
.dark .stat-value {
  color: #e2e8f0;
}

.stat-bar-bg {
  height: 4px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

:deep(.dark) .stat-bar-bg,
.dark .stat-bar-bg {
  background-color: rgba(255, 255, 255, 0.1);
}



.stat-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s ease-out;
}

/* Footer Action */
.pokemon-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  color: #6366f1; /* indigo-500 */
  opacity: 0.8;
  transition: all 0.2s ease;
}

:deep(.dark) .pokemon-card-footer,
.dark .pokemon-card-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.pokemon-card:hover .pokemon-card-footer {
  opacity: 1;
}

.view-details-text {
  font-size: 0.75rem;
  font-weight: 600;
}

.arrow-icon {
  transition: transform 0.2s ease;
}

.pokemon-card:hover .arrow-icon {
  transform: translateX(4px);
}

/* Fallback Type Colors if Tailwind bg-pokemon-* classes aren't available */
.bg-pokemon-normal { background-color: #A8A77A; }
.bg-pokemon-fire { background-color: #EE8130; }
.bg-pokemon-water { background-color: #6390F0; }
.bg-pokemon-electric { background-color: #F7D02C; }
.bg-pokemon-grass { background-color: #7AC74C; }
.bg-pokemon-ice { background-color: #96D9D6; }
.bg-pokemon-fighting { background-color: #C22E28; }
.bg-pokemon-poison { background-color: #A33EA1; }
.bg-pokemon-ground { background-color: #E2BF65; }
.bg-pokemon-flying { background-color: #A98FF3; }
.bg-pokemon-psychic { background-color: #F95587; }
.bg-pokemon-bug { background-color: #A6B91A; }
.bg-pokemon-rock { background-color: #B6A136; }
.bg-pokemon-ghost { background-color: #735797; }
.bg-pokemon-dragon { background-color: #6F35FC; }
.bg-pokemon-dark { background-color: #705848; }
.bg-pokemon-steel { background-color: #B7B7CE; }
.bg-pokemon-fairy { background-color: #D685AD; }
</style>
