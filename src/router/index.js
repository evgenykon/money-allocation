import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Allocation from '@/components/Allocation'
import History from '@/components/History'
import Generator from '@/components/Generator'
import Settings from '@/components/Settings'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Root',
      component: Home
    }, {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/allocation',
      name: 'Allocation',
      component: Allocation
    },
    {
      path: '/history',
      name: 'History',
      component: History
    },
    {
      path: '/generator',
      name: 'Generator',
      component: Generator
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ]
})
