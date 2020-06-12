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
        getCurrentBill(state) {
            return state.currentBill;
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

        },
        setCurrent(state, payload) {
            state.currentBill = payload;
        }
    },
    actions: {
        async loadBills(state) {
            const response = await Api.loadBills(state.getters.getToken, state.getters.getUid);
            state.commit('setBills', response.bills);
        },
        async setCurrent(state, payload) {
            if (state.getters.getBills.length === 0) {
                await state.dispatch('loadBills');
            }
            let bill = state.getters.getBills.filter(item => item.id === payload.id);
            if (bill.length !== 1) {
                throw new Error('Current not defined');
            }
            state.commit('setCurrent', bill[0]);
        },
        loadRevisions() {

        },
        async createBill(state, payload) {
            console.debug('s.createBill', payload);
            const response = await Api.createBill(
                state.getters.getToken, 
                state.getters.getUid, 
                payload.name
            );
            if (!response.result) {
                throw Error('Unable to create bill');
            }
            if (isNaN(parseFloat(payload.initAmount))) {
                throw Error('Amount is not a number');
            }
            /*response = await Api.createBill(
                state.getters.getToken, 
                state.getters.getUid, 
                payload.name
            );*/
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
