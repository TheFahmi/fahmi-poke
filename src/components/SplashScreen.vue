<template>
  <div 
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#020617] transition-all duration-1000 ease-in-out font-inter"
    :class="{ 'opacity-0 invisible': isFading, 'opacity-100 visible': !isFading }"
  >
    <div class="flex flex-col items-center justify-center w-full max-w-md px-6 transform transition-transform duration-1000" :class="{ 'scale-95': isFading, 'scale-100': !isFading }">
      
      <!-- Minimalist Logo / Title -->
      <div class="mb-12 flex flex-col items-center">
        <!-- Abstract Modern Pokedex Icon -->
        <div class="w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700/50 shadow-2xl flex items-center justify-center relative overflow-hidden">
          <div class="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600/50 flex items-center justify-center relative">
            <div class="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
          </div>
          <div class="absolute top-2 left-2 w-2 h-2 rounded-full bg-red-500/80"></div>
          <div class="absolute top-2 left-5 w-1.5 h-1.5 rounded-full bg-yellow-500/80"></div>
          <div class="absolute top-2 left-8 w-1.5 h-1.5 rounded-full bg-green-500/80"></div>
        </div>
        <h1 class="text-2xl font-semibold tracking-[0.2em] text-gray-900 dark:text-gray-200 mb-2">POKÉDEX</h1>
      </div>

      <!-- Loading Bar -->
      <div class="w-full max-w-[200px] mb-6">
        <div class="h-[1px] w-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
          <div class="absolute inset-y-0 left-0 h-full bg-indigo-500 w-full loading-bar"></div>
        </div>
      </div>

      <!-- Loading Message -->
      <div class="h-6 flex items-center justify-center mb-16">
        <p class="text-sm text-gray-500 dark:text-gray-400 tracking-wide font-light transition-opacity duration-300">{{ loadingMessage }}</p>
      </div>

      <!-- Start Button -->
      <button 
        @click="startJourney"
        class="group px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium tracking-wide rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-95"
      >
        START
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  duration: {
    type: Number,
    default: 3000
  }
});

const emit = defineEmits(['complete']);

const isFading = ref(false);
const loadingMessages = [
  "Loading Pokédex data...",
  "Connecting to Professor Oak's lab...",
  "Preparing your starter Pokémon...",
  "Organizing Poké Balls...",
  "Checking the tall grass...",
  "Training your first Pokémon...",
  "Waiting for Nurse Joy...",
  "Challenging Gym Leaders...",
  "Catching legendary Pokémon...",
  "Team Rocket blasting off again!"
];
const loadingMessage = ref(loadingMessages[0]);
let messageInterval;

// Function to start the journey immediately
const startJourney = () => {
  isFading.value = true;
  // Short timeout to allow fade animation to start before emitting complete
  setTimeout(() => {
    emit('complete');
    clearInterval(messageInterval);
  }, 500);
};

// Cycle through loading messages
onMounted(() => {
  let index = 0;
  messageInterval = setInterval(() => {
    index = (index + 1) % loadingMessages.length;
    loadingMessage.value = loadingMessages[index];
  }, 2000);

  // Start the fade out after the specified duration
  setTimeout(() => {
    isFading.value = true;
  }, props.duration - 1000);

  // Complete the splash screen after fade
  setTimeout(() => {
    emit('complete');
    clearInterval(messageInterval);
  }, props.duration);
});

onBeforeUnmount(() => {
  clearInterval(messageInterval);
});
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.loading-bar {
  animation: sweep 1.5s ease-in-out infinite;
}

@keyframes sweep {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
</style>
