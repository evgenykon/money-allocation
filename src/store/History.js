import Db from '@/helpers/db.js';

const Income = {
  amount: .00,
  dt: null
};

const History = {
  state: {
    records: []
  },
  getters: {
    getHistoryRecords: (state) => {
      return state.items;
    }
  },
  actions: {
    loadDb: (state, payload) => {
      return Db.loadDb().then((data) => {
        if (data.history === undefined) {
          throw Error('No history structure in DB');
        }
        for (let i in data.history) {
          state.commit('addRecord', data.history[i]);
        }
        console.debug('History', 'loaded', data.history.length);
      });
    }
  },
  mutations: {
    addRecord: (state, payload) => {
      state.records.push(payload);
    }
  }
}
export default History;
