<template>
  <div
    class="group relative bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-all animate-pulse fade-in-skeleton h-full w-full aspect-[3/4]"
  >
    <!-- Pokemon ID Badge Skeleton -->
    <div class="absolute top-3 left-3 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full w-14 h-6"></div>

    <!-- Favorite Button Skeleton -->
    <div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md"></div>

    <!-- Pokemon Image Skeleton -->
    <div class="relative h-48 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white/5 to-white/20">
      <!-- Pokemon Image Placeholder -->
      <div class="w-40 h-40 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-white/20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z"></path>
          <path d="M12 6a6 6 0 106 6 6 6 0 00-6-6zm0 10a4 4 0 114-4 4 4 0 01-4 4z"></path>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      </div>

      <!-- Type Badges Skeleton -->
      <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        <div class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm w-20 h-6 shadow-md"></div>
        <div class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm w-20 h-6 shadow-md"></div>
      </div>
    </div>

    <!-- Pokemon Info Skeleton -->
    <div class="p-4">
      <!-- Pokemon Name Skeleton -->
      <div class="h-7 bg-white/20 backdrop-blur-sm rounded w-3/4 mx-auto mb-3"></div>

      <!-- Pokemon Stats Preview Skeleton -->
      <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-white/80">
        <div class="flex flex-col items-center bg-white/10 rounded-lg p-2">
          <div class="w-14 h-4 mb-1 bg-white/20 backdrop-blur-sm rounded"></div>
          <div class="w-10 h-5 bg-white/20 backdrop-blur-sm rounded font-bold"></div>
        </div>
        <div class="flex flex-col items-center bg-white/10 rounded-lg p-2">
          <div class="w-14 h-4 mb-1 bg-white/20 backdrop-blur-sm rounded"></div>
          <div class="w-10 h-5 bg-white/20 backdrop-blur-sm rounded font-bold"></div>
        </div>
      </div>

      <!-- View Details Button Skeleton -->
      <div class="mt-4 w-full py-2 h-10 bg-white/20 backdrop-blur-sm rounded-lg"></div>
    </div>

    <!-- Shimmer Effect -->
    <div class="shimmer"></div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-pulse {
  animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Fade in animation for skeletons */
@keyframes fadeInSkeleton {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in-skeleton {
  animation: fadeInSkeleton 0.5s ease-in-out;
}

/* Shimmer effect */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s infinite;
  pointer-events: none;
}
</style>
