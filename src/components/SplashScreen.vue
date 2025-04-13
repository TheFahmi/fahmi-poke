<template>
  <div 
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pokemon-yellow via-pokemon-red to-pokemon-blue"
    :class="{ 'fade-out': isFading }"
  >
    <div class="relative">
      <!-- Pokémon Logo -->
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"
        alt="Pokémon Logo"
        class="w-64 md:w-80 mb-8 animate-bounce-slow"
      >
      
      <!-- Pokéball Animation -->
      <div class="pokeball-container">
        <div class="pokeball">
          <div class="pokeball-top"></div>
          <div class="pokeball-middle">
            <div class="pokeball-button"></div>
          </div>
          <div class="pokeball-bottom"></div>
        </div>
      </div>
      
      <!-- Loading Text -->
      <div class="text-white text-xl font-bold mt-8 text-center">
        <p>Loading Pokédex</p>
        <div class="flex justify-center mt-2">
          <div class="dot-flashing"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  duration: {
    type: Number,
    default: 2500 // Default duration in milliseconds
  }
})

const emit = defineEmits(['complete'])
const isFading = ref(false)

onMounted(() => {
  // Start the fade out animation after the specified duration
  setTimeout(() => {
    isFading.value = true
    
    // Emit the complete event after the animation finishes
    setTimeout(() => {
      emit('complete')
    }, 1000) // Animation duration
  }, props.duration)
})
</script>

<style scoped>
/* Fade out animation */
.fade-out {
  animation: fadeOut 1s forwards;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Pokéball Animation */
.pokeball-container {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
}

.pokeball {
  width: 100%;
  height: 100%;
  position: relative;
  animation: shake 1.5s ease-in-out infinite;
  transform-origin: center;
}

.pokeball-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background-color: #f00;
  border-radius: 50px 50px 0 0;
  border: 5px solid #333;
  border-bottom: none;
  box-sizing: border-box;
}

.pokeball-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background-color: #fff;
  border-radius: 0 0 50px 50px;
  border: 5px solid #333;
  border-top: none;
  box-sizing: border-box;
}

.pokeball-middle {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: #333;
  transform: translateY(-50%);
  z-index: 2;
}

.pokeball-button {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background-color: #fff;
  border: 5px solid #333;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  box-shadow: 0 0 0 5px #fff;
}

@keyframes shake {
  0%, 100% {
    transform: rotate(-10deg);
  }
  25% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

/* Bouncing Animation */
.animate-bounce-slow {
  animation: bounce 3s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Loading Dots Animation */
.dot-flashing {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #fff;
  color: #fff;
  animation: dot-flashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}

.dot-flashing::before, .dot-flashing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-flashing::before {
  left: -15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #fff;
  color: #fff;
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #fff;
  color: #fff;
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dot-flashing {
  0% {
    background-color: #fff;
  }
  50%, 100% {
    background-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
