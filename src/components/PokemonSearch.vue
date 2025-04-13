<template>
  <div class="relative w-full">
    <form @submit.prevent="handleSearch">
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search Pokémon by name or ID..."
          v-model="searchValue"
          class="w-full py-3 pl-10 pr-12 rounded-lg border-0 bg-white/90 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-primary-500 focus:outline-none focus:bg-white transition-all duration-200"
        >
        <button
          v-if="searchValue"
          type="button"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Define emits
const emit = defineEmits(['search'])

// State
const searchValue = ref('')

// Methods
const handleSearch = () => {
  if (searchValue.value.trim()) {
    emit('search', searchValue.value.trim().toLowerCase())
  }
}

const clearSearch = () => {
  searchValue.value = ''
  // Focus the input after clearing
  setTimeout(() => {
    document.querySelector('input').focus()
  }, 0)
}
</script>