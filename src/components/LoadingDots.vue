<template>
  <div class="inline-flex items-center justify-center gap-1.5">
    <div class="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-400 animate-dot-1"></div>
    <div class="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-400 animate-dot-2"></div>
    <div class="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-400 animate-dot-3"></div>
  </div>
</template>

<style scoped>
.animate-dot-1 {
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0s;
}
.animate-dot-2 {
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0.3s;
}
.animate-dot-3 {
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0.6s;
}

@keyframes dot-flashing {
  0% {
    opacity: 0.8;
    transform: scale(1);
  }
  50%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
}
</style>
