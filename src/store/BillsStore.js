'use strict';

import Api from '../services/Api.js';

const BillsStore = {
    state: {
        bills: [],
        currentBill: null,
        revisions: []
    },
    getters: {
        getBills(state) {
            return state.bills;
        },
        getCurrentBill() {

        },
        getRevisions() {

        },
        getLastRevision() {

        }
    },
    mutations: {
        setBills(state, payload) {
            state.bills = payload;
        },
        setCurrentBill() {

        },
        setRevisions() {

        }
    },
    actions: {
        async loadBills(state) {
            const response = await Api.loadBills(state.getters.getToken, state.getters.getUid);
            console.debug('loadBills response', response);
            state.commit('setBills', response.bills);
        },
        setCurrent() {

        },
        loadRevisions() {

        },
        createBill() {

        },
        updateBill() {

        },
        deleteBill() {

        },
        createRevision() {

        },
        cancelLastRevision() {

        },
        transfer() {

        }
    }
}

export default BillsStore;
