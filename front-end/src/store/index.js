import Vue from 'vue'
import Vuex from 'vuex';
import axios from '@/axios';
import axiosWrapper from './utils/axiosWrapper';
import quoteModule from './quote';
import errorsModule from './errors';
import loaderModule from './loader';

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        quoteModule,
        errorsModule,
        loaderModule
    },
    actions: {
        checkServerReady: axiosWrapper(() => {
            return axios.get('/ready');
        })
    }
})
