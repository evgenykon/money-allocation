'use strict';

import Api from '../services/Api.js';

const UserStore = {
    state: {
        isConnected: null,
        authData: null,
        permissions: null,
        token: null,
        uid: null,
        email: '',
        bill_group_proportions: null
    },
    getters: {
        isConnected: (state) => {
            return state.isConnected;
        },
        isAuthorized: (state) => {
            return state.authData !== false;
        },
        getToken: (state) => {
            return state.token;
        },
        getUid: (state) => {
            return state.uid;
        },
        getEmail: (state) => {
            return state.email;
        },
        getPermissions: (state) => {
            return state.permissions;
        },
        getBillGroupProportions: (state) => {
            return state.bill_group_proportions;
        }
    },
    mutations: {
        toggleConnection: (state, flag) => {
            state.isConnected = flag;
        },
        setAuthData: (state, payload) => {
            state.authData = payload;
            if (payload && payload.id) {
                state.uid = payload.id;
                state.email = payload.email;
                state.permissions = payload.permissions;
                if (payload.token) {
                    state.token = payload.token;
                }
                if (payload.bill_group_proportions) {
                    state.bill_group_proportions = payload.bill_group_proportions;
                }
            } else {
                state.uid = null;
                state.email = '';
                state.token = null;
                state.permissions = null;
                state.bill_group_proportions = null;
            }
        },
        setBillGroupProportions: (state, proportions) => {
            state.bill_group_proportions = proportions;
        }
    },
    actions: {
        checkConnection: (state) => {
            return new Promise((resolve, reject) => {
                Api.checkConnection()
                    .then((result) => {
                        if (result === false) {
                            throw Error('Connection test failed');
                        }
                        state.commit('toggleConnection', true);
                        resolve();
                    })
                    .catch((err) => {
                        console.error('a.checkConnection err', err);
                        state.commit('toggleConnection', false);
                        reject();
                    });
            });
        },
        checkAuth: (state) => {
            return new Promise( (resolve, reject) => {
                Api.checkAuth(state.getters.getToken, state.getters.getUid)
                    .then((payload) => {
                        if ( payload.result === false ) {
                            state.commit('setAuthData', false);
                            return reject('Unauthorized');
                        }
                        state.commit('setAuthData', payload.user);
                        resolve();
                    })
                    .catch((e) => {
                        state.commit('setAuthData', false);
                        reject(e);
                    });
            });
        },
        register: (state, payload) => {
            return new Promise((resolve, reject) => {
                Api.register(payload)
                    .then((response) => {
                        state.commit('setAuthData', response.user);
                        if (response.result && response.user.id) {
                            resolve();
                        } else if (response.error) {
                            reject(response.message);
                        } else {
                            reject('Ошибка протокола');
                        }
                    })
                    .catch(reject);
            });
        },
        login: (state, payload) => {
            return new Promise((resolve, reject) => {
                Api.login(payload)
                    .then((response) => {
                        state.commit('setAuthData', response.user);
                        if (response.result && response.user.id) {
                            resolve();
                        } else if (response.error) {
                            reject(response.message);
                        } else {
                            reject('Ошибка протокола');
                        }
                    })
                    .catch(reject);
            });
        },
        logout: (state) => {
            return new Promise((resolve) => {
                state.commit('setAuthData', false);
                resolve();
            });
        }
    }
}

export default UserStore;
