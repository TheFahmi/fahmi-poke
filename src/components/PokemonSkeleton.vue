<template>
  <div
    class="skeleton-card bg-white dark:bg-surface-card rounded-card border border-gray-200 dark:border-gray-700/30 shadow-card overflow-hidden animate-pulse"
  >
    <!-- Image Area Skeleton -->
    <div class="aspect-square bg-gray-200 dark:bg-primary-800/50 flex items-center justify-center">
      <div class="w-20 h-20 rounded-full bg-gray-300 dark:bg-primary-700/50"></div>
    </div>

    <!-- Content Area Skeleton -->
    <div class="p-4 space-y-3">
      <!-- ID -->
      <div class="h-3 w-10 bg-gray-300 dark:bg-primary-700/50 rounded"></div>
      <!-- Name -->
      <div class="h-5 w-3/4 bg-gray-300 dark:bg-primary-700/50 rounded"></div>
      <!-- Type badges -->
      <div class="flex gap-2">
        <div class="h-5 w-14 bg-gray-300 dark:bg-primary-700/50 rounded-full"></div>
        <div class="h-5 w-14 bg-gray-300 dark:bg-primary-700/50 rounded-full"></div>
      </div>
      <!-- Stat bar -->
      <div class="pt-1">
        <div class="h-1.5 w-full bg-gray-300 dark:bg-primary-700/50 rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isCaught: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.skeleton-card {
  transition: transform 0.3s ease;
}
</style>
