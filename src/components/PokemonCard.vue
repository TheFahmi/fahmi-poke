<template>
  <div
    class="group relative bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2"
    @click="$emit('select-pokemon', pokemon)"
  >
    <!-- Card Header with Pokémon ID -->
    <div class="absolute top-3 left-3 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold text-white">
      #{{ pokemon.id?.toString().padStart(3, '0') || '000' }}
    </div>

    <!-- Favorite Button with Animation -->
    <button
      @click.stop="toggleFavorite"
      class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-white/50 overflow-hidden"
      :class="{ 'animate-favorite-button': isAnimating }"
    >
      <!-- Heart Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        :fill="pokemon.isLike ? 'red' : 'none'"
        stroke="currentColor"
        class="w-5 h-5 transition-transform duration-300"
        :class="{
          'text-red-500': pokemon.isLike,
          'text-white': !pokemon.isLike,
          'animate-heart-beat': isAnimating
        }"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>

      <!-- Floating Hearts Animation -->
      <div v-if="isAnimating" class="absolute inset-0 pointer-events-none">
        <div class="heart-particle heart-1"></div>
        <div class="heart-particle heart-2"></div>
        <div class="heart-particle heart-3"></div>
        <div class="heart-particle heart-4"></div>
        <div class="heart-particle heart-5"></div>
      </div>
    </button>

    <!-- Pokemon Image Container -->
    <div class="relative h-48 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white/5 to-white/20">
      <!-- Pokemon Image -->
      <img
        :src="getPokemonImage(pokemon)"
        :alt="pokemon.name"
        class="h-40 w-40 object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-lg"
        loading="lazy"
      />

      <!-- Type Badges on Image -->
      <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        <span
          v-for="typeInfo in pokemon.types || []"
          :key="typeInfo.type?.name || 'unknown'"
          :class="`type-${typeInfo.type?.name || 'normal'}`"
          class="px-3 py-1 rounded-full text-xs font-bold shadow-md capitalize"
        >
          {{ typeInfo.type?.name || 'unknown' }}
        </span>
        <span v-if="!pokemon.types || pokemon.types.length === 0" class="type-normal px-3 py-1 rounded-full text-xs font-bold shadow-md capitalize">
          normal
        </span>
      </div>
    </div>

    <!-- Pokemon Info -->
    <div class="p-4">
      <h3 class="text-xl font-bold text-white capitalize text-center mb-2">
        {{ pokemon.name || 'Unknown' }}
      </h3>

      <!-- Pokemon Stats Preview -->
      <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-white/80">
        <div class="flex flex-col items-center bg-white/10 rounded-lg p-2">
          <span class="text-white/60">Height</span>
          <span class="font-bold text-white">{{ pokemon.height ? `${pokemon.height/10}m` : 'N/A' }}</span>
        </div>
        <div class="flex flex-col items-center bg-white/10 rounded-lg p-2">
          <span class="text-white/60">Weight</span>
          <span class="font-bold text-white">{{ pokemon.weight ? `${pokemon.weight/10}kg` : 'N/A' }}</span>
        </div>
      </div>

      <!-- View Details Button -->
      <button
        @click.stop="$emit('view-details', pokemon)"
        class="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors duration-300"
      >
        View Details
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'

// Props
const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['select-pokemon', 'view-details', 'toggle-favorite'])

// Store
const { toggleFavorite: toggleFavoritePokemon } = usePokemonStore()

// Animation state
const isAnimating = ref(false)

// Methods
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
  const id = pokemon.id || '1'
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

// Toggle favorite status with animation
const toggleFavorite = () => {
  // Toggle the favorite status in the store
  toggleFavoritePokemon(props.pokemon)

  // Start the animation
  isAnimating.value = true

  // Stop the animation after a delay
  setTimeout(() => {
    isAnimating.value = false
  }, 1000)

  // Emit the event
  emit('toggle-favorite', props.pokemon)
}
</script>

<style scoped>
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

/* Heart beat animation */
@keyframes heartBeat {
  0% { transform: scale(1); }
  15% { transform: scale(1.3); }
  30% { transform: scale(1); }
  45% { transform: scale(1.3); }
  60% { transform: scale(1); }
  100% { transform: scale(1); }
}

.animate-heart-beat {
  animation: heartBeat 1s ease-in-out;
}

/* Favorite button animation */
@keyframes favoriteButton {
  0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
}

.animate-favorite-button {
  animation: favoriteButton 1s ease-out;
}

/* Heart particles */
.heart-particle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: red;
  clip-path: path('M10,6.355c-0.705,0-1.305,0.43-1.559,1.041C8.187,6.785,7.587,6.355,6.883,6.355C6.058,6.355,5.5,6.912,5.5,7.736c0,1.369,2.941,3.918,2.941,3.918s2.941-2.549,2.941-3.918C11.382,6.912,10.824,6.355,10,6.355z');
  opacity: 0;
  pointer-events: none;
}

.heart-1 {
  animation: floatingHeart1 1s ease-out 0.1s forwards;
  top: 50%;
  left: 50%;
}

.heart-2 {
  animation: floatingHeart2 1s ease-out 0.2s forwards;
  top: 50%;
  left: 50%;
}

.heart-3 {
  animation: floatingHeart3 1s ease-out 0.3s forwards;
  top: 50%;
  left: 50%;
}

.heart-4 {
  animation: floatingHeart4 1s ease-out 0.4s forwards;
  top: 50%;
  left: 50%;
}

.heart-5 {
  animation: floatingHeart5 1s ease-out 0.5s forwards;
  top: 50%;
  left: 50%;
}

@keyframes floatingHeart1 {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translate(calc(-50% + 15px), calc(-50% - 30px)) scale(0.8);
    opacity: 0;
  }
}

@keyframes floatingHeart2 {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translate(calc(-50% - 20px), calc(-50% - 40px)) scale(0.6);
    opacity: 0;
  }
}

@keyframes floatingHeart3 {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translate(calc(-50% + 5px), calc(-50% - 50px)) scale(0.7);
    opacity: 0;
  }
}

@keyframes floatingHeart4 {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translate(calc(-50% - 15px), calc(-50% - 25px)) scale(0.5);
    opacity: 0;
  }
}

@keyframes floatingHeart5 {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translate(calc(-50% + 25px), calc(-50% - 35px)) scale(0.9);
    opacity: 0;
  }
}
</style>
