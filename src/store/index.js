import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import UserStore from './UserStore.js';
import BillsStore from './BillsStore.js';
import createPersistedState from "vuex-persistedstate";

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    UserStore, BillsStore
  }
})
