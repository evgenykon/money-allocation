import Vue from 'vue'
import VueRouter from 'vue-router'
import IntroView from '../views/IntroView.vue';
import AuthView from '../views/AuthView.vue';
import MoneyHomeView from '../views/MoneyHomeView.vue';
import FormsView from '../views/FormsView.vue';
import BillView from '../views/BillView.vue';
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
  },
  {
    path: '/money',
    name: 'Money',
    component: MoneyHomeView
  },
  {
    path: '/forms',
    name: 'Forms',
    component: FormsView
  },
  {
    path: '/bill',
    name: 'Bill',
    component: BillView
  }
]

const router = new VueRouter({
  routes
})

export default router
