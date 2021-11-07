import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import { routes } from './routes.js'
import VLazyImage from 'v-lazy-image'
import { createRouter, createWebHistory } from 'vue-router'

const app = createApp(App)


const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(VLazyImage)
app.use(router)
app.mount('#app')
