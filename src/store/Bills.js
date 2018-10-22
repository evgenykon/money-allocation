import Db from '@/helpers/db.js';
import _ from 'lodash';

const Bill = {
  id: null,
  name: '',
  category: '',
  amount: .00,
  percent: .00,
  limit: .00
};

const Bills = {
  state: {
    items: [],
    categories: [],
    currency: ''
  },
  getters: {
    getBillsItems: (state) => {
      return state.items;
    },
    getBillCategories: (state) => {
      return state.categories;
    },
    getTotalAmount: (state) => {
      let total = 0;
      for (let i in state.items) {
        total += _.round(state.items[i].amount, 2);
      }
      return total;
    },
    getCurrency: (state) => {
      return state.currency;
    },
    getBillsWithPercent: (state) => {
      let bills = [];
      for (let i in state.items) {
        if (state.items[i].percent > 0) {
          bills.push(state.items[i]);
        }
      }
      return bills;
    }
  },
  actions: {
    loadDb: (state) => {
      return Db.loadDb().then((data) => {
        state.commit('resetBills');
        if (data.bills === undefined) {
          throw Error('No bills structure in DB');
        }
        for (let i in data.bills) {
          state.commit('addBill', data.bills[i]);
        }
        console.debug('Bills', 'loaded', data.bills.length);
        state.commit('setCurrency', data.currency);
        let categories = [];
        for (let i in data.bills) {
          if (categories.indexOf(data.bills[i].category) == -1) {
            categories.push(data.bills[i].category);
          }
        }
        state.commit('setCategories', categories);
        console.debug('Bills', 'categories', categories.length);
      });
    },
    saveBills: (state) => {
      return Db.saveBills(state.getters.getBillsItems);
    },
    allocateMoney: (state, payload) => {
      state.commit('addHistoryIncome', {
        amount: payload.amount
      });
      for (let i in state.getters.getBillsWithPercent) {
        let item = state.getters.getBillsWithPercent[i];
        let income = _.round(item.percent * payload.amount / 100, 2);
        item.amount = _.round(parseFloat(item.amount) + parseFloat(income), 2);
        state.commit('updateBill', item);
        state.commit('addHistoryTransfer', {
          bill: item.id,
          amount: income,
          direction: 'in'
        });
        state.commit('addHistoryBalance', {
          bill: item.id,
          amount: item.amount
        });
      }
      state.dispatch('saveBills').then(()=>{
        state.dispatch('saveHistory');
      });
    },
    updateBillData: (state, payload) => {
      const getBillById = (id) => {
        for (let i in state.getters.getBillsItems) {
          let item = state.getters.getBillsItems[i];
          if (item.id === id) {
            return item;
          }
        }
      }
      const oldBill = getBillById(payload.id);
      state.commit('updateBill', payload);
      if (oldBill.amount !== payload.amount) {
        state.commit('addHistoryTransfer', {
          bill: payload.id,
          amount: _.round( Math.abs(payload.amount - oldBill.amount) ),
          direction: payload.amount > oldBill.amount ? 'in' : 'out'
        });
        state.commit('addHistoryBalance', {
          bill: payload.id,
          amount: payload.amount
        });
      }
      state.dispatch('saveBills').then(()=>{
        if (oldBill.amount !== payload.amount) {
          state.dispatch('saveHistory');
        }
      });
    }
  },
  mutations: {
    resetBills: (state) => {
      state.items = [];
    },
    addBill: (state, payload) => {
      state.items.push(payload);
    },
    updateBill: (state, payload) => {
      for (let i in state.items) {
        if (state.items[i].id === payload.id) {
          state.items[i] = payload;
          break;
        }
      }
    },
    setCategories: (state, payload) => {
      state.categories = payload;
    },
    addCategory: (state, payload) => {
      state.categories.push(payload);
    },
    setCurrency: (state, payload) => {
      state.currency = payload;
    },
    deleteBill: (state, payload) => {
      for (let i in state.items) {
        if (state.items[i].id === payload.id) {
          state.items.splice(i, 1);
          break;
        }
      }
    }
  }
}
export default Bills;
