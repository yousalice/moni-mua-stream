import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
// import Detail from './views/Detail.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})

export default router
