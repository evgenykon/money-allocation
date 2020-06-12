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
        getRevisions(state) {
            return state.revisions;
        },
        getLastRevision(state) {
            return state.revisions.length > 0 ? state.revisions[state.revisions.length - 1] : null;
        }
    },
    mutations: {
        setBills(state, payload) {
            state.bills = payload;
        },
        setRevisions(state, payload) {
            state.revisions = payload;
        },
        setCurrent(state, payload) {
            state.currentBill = payload;
        }
    },
    actions: {
        /**
         * 
         */
        async loadBills(state) {
            const response = await Api.loadBills(state.getters.getToken, state.getters.getUid);
            state.commit('setBills', response.bills);
        },

        /**
         * @param {*} state 
         * @param {*} payload 
         */
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

        /**
         * @param {*} state 
         * @param {*} payload 
         */
        async createBill(state, payload) {
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
        },
        updateBill() {

        },

        /**
         * @param {*} state 
         * @param {*} payload 
         */
        async deleteBill(state, payload) {
            await Api.deleteBill(
                state.getters.getToken, 
                state.getters.getUid, 
                payload.billId
            );
        },

        /**
         * @param {*} state 
         * @param {*} payload 
         */
        async loadRevisions(state, payload) {
            const response = await Api.loadRevisions(state.getters.getToken, state.getters.getUid, payload.billId, '2020-06-01');
            state.commit('setRevisions', response.revisions);
        },

        /**
         * @param {*} state 
         * @param {*} payload 
         */
        async createRevision(state, payload) {
            await Api.createRevision(
                state.getters.getToken, 
                state.getters.getUid, 
                payload.billId,
                payload.chargeAmount
            );
        },

        /**
         * @param {*} state 
         * @param {*} payload 
         */
        async declineLastRevision(state, payload) {
            await Api.declineLastRevision(
                state.getters.getToken, 
                state.getters.getUid, 
                payload.billId
            );
            await state.dispatch('loadRevisions', {
                billId: payload.billId
            });
        },
        transfer() {

        }
    }
}

export default BillsStore;
