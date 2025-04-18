<template>
  <button 
    @click="toggleDarkMode" 
    class="p-2 rounded-full transition-colors duration-200 focus:outline-none"
    :class="isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'"
    aria-label="Toggle dark mode"
  >
    <!-- Sun icon for light mode -->
    <svg 
      v-if="isDarkMode" 
      xmlns="http://www.w3.org/2000/svg" 
      class="h-5 w-5" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fill-rule="evenodd" 
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
        clip-rule="evenodd" 
      />
    </svg>
    
    <!-- Moon icon for dark mode -->
    <svg 
      v-else 
      xmlns="http://www.w3.org/2000/svg" 
      class="h-5 w-5" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" 
      />
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// State
const isDarkMode = ref(false)

// Initialize dark mode based on user preference or localStorage
onMounted(() => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme')
  
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    // Check user's system preference
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  // Apply theme
  applyTheme()
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDarkMode.value = e.matches
      applyTheme()
    }
  })
})

// Watch for changes to isDarkMode
watch(isDarkMode, () => {
  applyTheme()
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
})

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

// Apply theme to document
const applyTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>
