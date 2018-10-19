import Db from '@/helpers/db.js';

const Bill = {
  id: null,
  name: '',
  category: '',
  income: .00,
  amount: .00,
  percent: .00,
  limit: .00
};

const Bills = {
  state: {
    items: [],
    categories: []
  },
  getters: {
    getBillsItems: (state) => {
      return state.items;
    },
    getBillCategories: (state) => {
      if (!state.categories) {
        let categories = [];
        for (let i in state.items) {
          if (categories.indexOf(state.items[i].category) == -1) {
            categories.push(state.items[i].category);
          }
        }
        state.commit('setCategories', categories);
        return categories;
      } else {
        return state.categories;
      }
    }
  },
  actions: {
    loadDb: (state) => {
      return Db.loadDb().then((data) => {
        if (data.bills === undefined) {
          throw Error('No bills structure in DB');
        }
        for (let i in data.bills) {
          state.commit('addBill', data.bills[i]);
        }
        console.debug('Bills', 'loaded', data.bills.length);
      });
    }
  },
  mutations: {
    addBill: (state, payload) => {
      state.items.push(payload);
    },
    setCategories: (state, payload) => {
      state.categories = payload;
    },
    addCategory: (state, payload) => {
        state.categories.push(payload);
    }
  }
}
export default Bills;
