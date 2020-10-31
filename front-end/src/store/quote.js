import axios from '@/axios';

export default {
    strict: true,
    namespaced: true,
    state: {
        quoteToShow: {},
    },
    mutations: {
        setQuoteToShow(state, payload) {
            state.quoteToShow = payload;
        },
    },
    actions: {
        generateRandomQuote: wrapAxios(({commit}) => {
            return axios.get('/random').then(res => {
                commit('setQuoteToShow', {...res.data, personalRating: 0})
            });
        }),
        upVoteQuote: wrapAxios((ctx, payload) => {
            return axios.post('/upvote', payload);
        }),
        fetchSimilarQuote: wrapAxios(({commit}, payload) => {
            return axios.get('/similar', {params: payload}).then(res => commit('setQuoteToShow', res.data));
        })
    },
}

function wrapAxios(fn) {
    return function(ctx, payload) {
        fn(ctx, payload).catch(e => ctx.commit('errorsModule/addError', e, { root: true }))
    }
}