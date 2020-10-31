import Vue from 'vue'
import Vuex from 'vuex'
import quoteModule from './quote';
import errorsModule from './errors';

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        quoteModule,
        errorsModule
    }
})
