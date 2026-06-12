import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/MenuLogin.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/estoque', component: { template: '<div></div>' } }
]

export default createRouter({
  history: createWebHistory(),
  routes
})