'use strict';

import axios from 'axios';
import crypto from 'crypto';

const axiosConfig = {
    headers: {'Access-Control-Allow-Origin': '*'}
};
const AppSettings = require('../../app-settings.json');

const hashSomething = (str) => {
    return crypto.createHash('sha256').update(str).digest('hex');
}

class Api {
    constructor() {
        if (process.env.NODE_ENV && process.env.NODE_ENV==='development') {
            this.url = AppSettings.api_dev;
        } else {
            this.url = AppSettings.api;
        }
        axios.defaults.baseURL = this.url;
        console.debug('Api.url', this.url);
    }
    getAuthToken(token, uid) {
        const timestamp = new Date().getTime();
        return uid + ':' + timestamp + ':' + hashSomething(timestamp + token);
    }

    getAxiosAuth(token, uid) {
        if (!token || !uid) {
            throw Error('Unauthorized');
        }
        return axios.create({
            baseURL: this.url,
            timeout: 5000,
            headers: {'Authorization': 'token ' + this.getAuthToken(token, uid)}
        });
    }

    async checkConnection() {
        const response = await axios.get('/', axiosConfig);
        return response.data ? response.data.result : false;
    }

    async checkAuth(token, uid) {
        console.debug('BotApi.checkAuth', token, uid);
        if (!token || !uid) {
            throw Error('Unauthorized');
        }
        const response = await this.getAxiosAuth(token, uid).get('/user/me', axiosConfig);
        console.debug('checkAuth', response);
        if (response && response.data && response.data.result) {
            return response.data;
        } else {
            throw Error(response && response.data && response.data.message ? response.data.message : 'API result is false');
        }
    }

    async register(form) {
        if (!form.email || !form.name || !form.password) {
            throw Error('Some form fields is empty');
        }
        const response = await axios.put('/user/register', form);
        if (!response.data || response.data.result === false) {
            throw Error(response.data.message ? 'Server error: ' + response.data.message : 'API result is false');
        }
        return response.data;
    }

    async login(form) {
        if (!form.email || !form.password) {
            throw Error('Some form fields is empty');
        }
        const response = await axios.post('/user/login', form);
        if (!response.data || response.data.result === false) {
            throw Error(response.data.message ? 'Server error: ' + response.data.message : 'API result is false');
        }
        return response.data;
    }
}

export default new Api;
