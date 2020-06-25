'use strict';

import Api from '../services/Api.js';

const BillsStore = {
    state: {
        bills: [],
        currentBill: null,
        billRevisions: [],
        allRevisions: [],
        groups: [],
        currentGroup: null
    },
    getters: {
        getBills(state) {
            return state.bills;
        },
        getCurrentBill(state) {
            return state.currentBill;
        },
        getBillRevisions(state) {
            return state.billRevisions;
        },
        getLastRevision(state) {
            return state.billRevisions.length > 0 ? state.billRevisions[state.billRevisions.length - 1] : null;
        },
        getGroups(state) {
            return state.groups;
        },
        getAllRevisions(state) {
            return state.allRevisions;
        }
    },
    mutations: {
        setBills(state, payload) {
            state.bills = payload;
        },
        setBillRevisions(state, payload) {
            state.billRevisions = payload;
        },
        setAllRevisions(state, payload) {
            state.allRevisions = payload;
        },
        setCurrentBill(state, payload) {
            state.currentBill = payload;
        },
        setGroups(state, payload) {
            state.groups = payload;
        }
    },
    actions: {
        
        /**
         * @param {*} state 
         */
        async loadBills(state) {
            const response = await Api.loadBills(state.getters.getToken, state.getters.getUid);
            state.commit('setBills', response.bills);
        },

        /**
         * @param {*} state 
         * @param {*} payload 
         */
        async setCurrentBill(state, payload) {
            if (state.getters.getBills.length === 0) {
                await state.dispatch('loadBills');
            }
            let bill = state.getters.getBills.filter(item => item.id === payload.id);
            if (bill.length !== 1) {
                throw new Error('Current not defined');
            }
            state.commit('setCurrentBill', bill[0]);
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
            //@todo
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
        async loadBillRevisions(state, payload) {
            const response = await Api.loadBillRevisions(state.getters.getToken, state.getters.getUid, payload.billId, '2020-06-01');
            state.commit('setBillRevisions', response.revisions);
        },

        /**
         * @param {*} state 
         * @param {*} payload 
         */
        async loadAllRevisions(state) {
            const response = await Api.loadAllRevisions(state.getters.getToken, state.getters.getUid, '2020-06-01');
            state.commit('setAllRevisions', response.revisions);
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
            await state.dispatch('loadBillRevisions', {
                billId: payload.billId
            });
        },

        /**
         * @param {*} state 
         * @param {*} payload 
         */
        async transfer(state, payload) {
            await Api.transfer(
                state.getters.getToken, 
                state.getters.getUid, 
                payload.sourceBillId,
                payload.targetBillId,
                payload.transferAmount
            );
        },

        /**
         * @param {*} state 
         * @param {*} payload 
         */
        async createBillGroup(state, payload) {
            await Api.createGroup(
                state.getters.getToken, 
                state.getters.getUid, 
                payload.name,
                payload.color,
                payload.includedBills,
                payload.mainBill,
                payload.proportion
            );
        },

        /**
         * @param {*} state 
         * @param {*} payload 
         */
        async updateBillGroup(state, payload) {
            const result = await Api.updateGroup(
                state.getters.getToken, 
                state.getters.getUid, 
                payload.id,
                payload.name,
                payload.color,
                payload.includedBills,
                payload.mainBill,
                payload.proportion
            );
            state.commit('setBillGroupProportions', result.bill_group_proportions);
        },

        /**
         * @param {*} state 
         */
        async loadGroups(state) {
            const response = await Api.getGroups(
                state.getters.getToken, 
                state.getters.getUid
            );
            state.commit('setGroups', response.groups);
            state.commit('setBillGroupProportions', response.bill_group_proportions);
        },

        async deleteBillGroup(state, payload) {
            await Api.deleteBillGroup(
                state.getters.getToken, 
                state.getters.getUid,
                payload.id
            );
        }
    }
}

export default BillsStore;
