import { createSSRApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import { routes } from './routes.js'
import VLazyImage from 'v-lazy-image'
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'


export function createApp() {
  const app = createSSRApp(App)
  const isClient = typeof window !== 'undefined'
  const router = createRouter({
    history: isClient 
   ? createWebHistory() 
   : createMemoryHistory(), 
    routes,
  })
  if (isClient) {
    app.use(router)
    app.use(VLazyImage)
  }
  app.mount('#app')
  return { app, router }
}




