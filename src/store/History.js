import Db from '@/helpers/db.js';

const Income = {
  amount: .00,
  dt: null
};
const Transfer = {
  bill: null,
  direction: null,
  amount: .00,
  dt: null
};
const Balance = {
    bill: null,
    amount: .00,
    dt: null
}

const History = {
  state: {
      incomes: [],
      transfers: [],
      balances: []
  },
  getters: {
    getHistoryIncomes: (state) => {
      return state.incomes;
    },
    getHistoryTransfers: (state) => {
      return state.transfers;
    },
    getHistoryBalances: (state) => {
      return state.balances;
    }
  },
  actions: {
    loadDb: (state, payload) => {
      return Db.loadDb().then((data) => {
        if (data.history === undefined) {
          throw Error('No history structure in DB');
        }
        if (data.history.incomes) {
          for (let i in data.history.incomes) {
            state.commit('addHistoryIncome', data.history.incomes[i]);
          }
          console.debug('loadDb', 'load incomes', data.history.incomes.length);
        }
        if (data.history.transfers) {
          for (let i in data.history.transfers) {
            state.commit('addHistoryTransfer', data.history.transfers[i]);
          }
          console.debug('loadDb', 'load transfers', data.history.transfers.length);
        }
        if (data.history.balances) {
          for (let i in data.history.balances) {
            state.commit('addHistoryBalance', data.history.balances[i]);
          }
          console.debug('loadDb', 'load balances', data.history.balances.length);
        }
        console.debug('loadDb', data.history);
      });
    },
    saveHistory: (state) => {
      return Db.saveHistory({
        incomes: state.getters.getHistoryIncomes,
        transfers: state.getters.getHistoryTransfers,
        balances: state.getters.getHistoryBalances
      });
    },
  },
  mutations: {
    addHistoryIncome: (state, payload) => {
      let item = Object.assign({}, Income);
      item.amount = payload.amount;
      item.dt = payload.dt ? payload.dt : new Date();
      state.incomes.push(item);
    },
    addHistoryTransfer: (state, payload) => {
      let item = Object.assign({}, Transfer);
      item.bill = payload.bill;
      item.amount = payload.amount;
      item.direction = payload.direction;
      item.dt = payload.dt ? payload.dt : new Date();
      state.transfers.push(item);
    },
    addHistoryBalance: (state, payload) => {
      let item = Object.assign({}, Balance);
      item.bill = payload.bill;
      item.amount = payload.amount;
      item.dt = payload.dt ? payload.dt : new Date();
      state.balances.push(item);
    }
  }
}
export default History;
