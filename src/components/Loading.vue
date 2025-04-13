<template>
  <div class="h-screen w-full text-center relative flex flex-col items-center justify-center">
    <div class="w-24 h-24 rounded-full border-8 border-gray-200 border-t-pokemon-red animate-spin mb-4"></div>
    <p class="text-white font-semibold text-xl">Loading Pokémon...</p>
  </div>
</template>

<script setup>
// Modern loading component
</script>

<style scoped>
.border-t-pokemon-red {
  border-top-color: #e20000;
}
</style>