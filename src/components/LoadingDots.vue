<template>
  <div class="loading-dots-container">
    <div class="loading-dots">
      <div class="loading-dots__dot"></div>
      <div class="loading-dots__dot"></div>
      <div class="loading-dots__dot"></div>
    </div>
  </div>
</template>

<style scoped>
.loading-dots-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.loading-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.loading-dots__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: white;
  opacity: 0.7;
}

.loading-dots__dot:nth-child(1) {
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0s;
}

.loading-dots__dot:nth-child(2) {
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0.3s;
}

.loading-dots__dot:nth-child(3) {
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0.6s;
}

@keyframes dot-flashing {
  0% {
    opacity: 0.7;
    transform: scale(1);
  }
  50%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
}
</style>
