import Vue from 'vue';
import Vuex from 'vuex';

import Bills from './Bills.js';
import History from './History.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Bills,
    History
  }
})
