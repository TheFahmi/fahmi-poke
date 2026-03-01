<template>
  <div class="lazy-image-container relative overflow-hidden flex items-center justify-center" :style="{ height: height, width: width }">
    <!-- Loading skeleton -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-primary-800/30">
      <div class="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-primary-600 border-t-accent animate-spin"></div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/50 dark:bg-primary-800/20 p-2">
      <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <p class="text-gray-400 dark:text-gray-500 text-xs text-center">Image unavailable</p>
    </div>

    <!-- Actual image -->
    <img
      v-show="loaded && !error"
      ref="img"
      :src="src"
      :alt="alt"
      :class="imageClass"
      @load="onLoad"
      @error="onError"
      class="max-w-full max-h-full object-contain transition-opacity duration-300"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  },
  class: {
    type: String,
    default: ''
  }
});

const img = ref(null);
const loading = ref(true);
const loaded = ref(false);
const error = ref(false);

const imageClass = computed(() => {
  return props.class;
});

const onLoad = () => {
  loading.value = false;
  loaded.value = true;
};

const onError = () => {
  loading.value = false;
  error.value = true;
};

watch(() => props.src, (newSrc) => {
  if (newSrc) {
    loading.value = true;
    loaded.value = false;
    error.value = false;
  }
});

onMounted(() => {
  if (img.value?.complete) {
    loading.value = false;
    loaded.value = true;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (img.value) {
            img.value.src = props.src;
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });

    if (img.value) {
      observer.observe(img.value);
    }
  } else {
    if (img.value) {
      img.value.src = props.src;
    }
  }
});
</script>
