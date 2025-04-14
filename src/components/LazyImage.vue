<template>
  <div class="relative" :class="{ 'lazy-loaded': hasLoaded, 'lazy-visible': isVisible && !hasLoaded }">
    <!-- Skeleton loader shown while image is loading -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-md animate-pulse"
    >
      <div class="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white/20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z"></path>
          <path d="M12 6a6 6 0 106 6 6 6 0 00-6-6zm0 10a4 4 0 114-4 4 4 0 01-4 4z"></path>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      </div>
      <!-- Shimmer Effect -->
      <div class="shimmer"></div>
    </div>

    <!-- Debug indicator for visibility state -->
    <div v-if="isVisible && !hasLoaded" class="absolute top-0 right-0 bg-yellow-500 text-xs text-white px-1 py-0.5 rounded-bl z-10">Loading</div>
    <div v-if="hasLoaded" class="absolute top-0 right-0 bg-green-500 text-xs text-white px-1 py-0.5 rounded-bl z-10">Loaded</div>

    <!-- Actual image with IntersectionObserver for lazy loading -->
    <img
      ref="imageRef"
      :src="currentSrc"
      :alt="alt"
      :class="[imgClass, { 'opacity-0': loading, 'opacity-100 transition-opacity duration-300': !loading }]"
      @load="onImageLoaded"
      @error="onImageError"
      width="150"
      height="150"
      loading="lazy"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Image'
  },
  imgClass: {
    type: String,
    default: 'w-full h-auto'
  },
  fallbackSrc: {
    type: String,
    default: ''
  },
  showIndicators: {
    type: Boolean,
    default: false // Set to true to show loading/loaded indicators
  }
});

const loading = ref(true);
const imageRef = ref(null);
const currentSrc = ref('');
const observer = ref(null);
const isVisible = ref(false);
const hasLoaded = ref(false);

// Load the image when it enters the viewport
const loadImage = () => {
  console.log('Loading image:', props.src);
  isVisible.value = true;
  // Use requestAnimationFrame to ensure the browser has time to paint before loading the image
  requestAnimationFrame(() => {
    currentSrc.value = props.src;
  });
};

// Handle successful image load
const onImageLoaded = () => {
  console.log('Image loaded successfully:', props.src);
  loading.value = false;
  hasLoaded.value = true;

  // Dispatch a custom event that the image has loaded
  if (imageRef.value) {
    imageRef.value.dispatchEvent(new CustomEvent('imageLoaded', {
      bubbles: true,
      detail: { src: props.src }
    }));
  }
};

// Handle image load error
const onImageError = () => {
  console.error(`Failed to load image: ${props.src}`);
  if (props.fallbackSrc) {
    currentSrc.value = props.fallbackSrc;
  } else {
    // Use a default placeholder
    currentSrc.value = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
  }
  loading.value = false;

  // Dispatch a custom event that the image failed to load
  if (imageRef.value) {
    imageRef.value.dispatchEvent(new CustomEvent('imageError', {
      bubbles: true,
      detail: { src: props.src, error: true }
    }));
  }
};

// Check if image is already in browser cache
const checkImageCache = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log('Image already in cache:', src);
      resolve(true);
    };
    img.onerror = () => {
      console.log('Image not in cache:', src);
      resolve(false);
    };
    img.src = src;
  });
};

// Watch for src changes
watch(() => props.src, (newSrc) => {
  if (newSrc !== currentSrc.value) {
    loading.value = true;
    currentSrc.value = newSrc;
  }
});

onMounted(async () => {
  // Set a placeholder or transparent image initially
  currentSrc.value = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  // Check if image is already in browser cache
  const isCached = await checkImageCache(props.src);
  if (isCached) {
    // If image is already cached, load it immediately
    console.log('Loading cached image immediately:', props.src);
    isVisible.value = true;
    hasLoaded.value = true;
    loading.value = false;
    currentSrc.value = props.src;
    return;
  }

  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    // Set up IntersectionObserver for lazy loading
    observer.value = new IntersectionObserver((entries) => {
      console.log('IntersectionObserver triggered:', entries[0].isIntersecting, 'for image:', props.src);
      if (entries[0].isIntersecting) {
        isVisible.value = true;
        loadImage();
        // Unobserve after loading to save resources
        if (observer.value && imageRef.value) {
          observer.value.unobserve(imageRef.value);
          console.log('Unobserved image:', props.src);
        }
      }
    }, {
      rootMargin: '200px', // Start loading when within 200px of viewport
      threshold: 0.1
    });

    // Start observing the image element
    if (imageRef.value) {
      observer.value.observe(imageRef.value);
      console.log('Started observing image:', props.src);
    } else {
      console.warn('Image ref not available for:', props.src);
    }
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    loadImage();
  }
});

// Clean up observer when component is unmounted
onUnmounted(() => {
  if (observer.value && imageRef.value) {
    observer.value.unobserve(imageRef.value);
    observer.value = null;
  }
});
</script>

<style scoped>
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

/* Visual indicators for lazy loading states */
.lazy-visible {
  border: 2px solid rgba(255, 193, 7, 0.5); /* Yellow border for visible but not loaded */
}

.lazy-loaded {
  border: 2px solid rgba(40, 167, 69, 0.5); /* Green border for loaded */
}
</style>
