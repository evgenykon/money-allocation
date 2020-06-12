import Vue from 'vue'
import VueRouter from 'vue-router'
import IntroView from '../views/IntroView.vue';
import AuthView from '../views/AuthView.vue';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: IntroView
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView
  }
]

const router = new VueRouter({
  routes
})

export default router
