import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/IntroView.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/AuthView.vue')
  },
  {
    path: '/money',
    name: 'Money',
    component: () => import('../views/MoneyHomeView.vue')
  },
  {
    path: '/forms',
    name: 'Forms',
    component: () => import('../views/FormsView.vue')
  },
  {
    path: '/bill',
    name: 'Bill',
    component: () => import('../views/BillView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
