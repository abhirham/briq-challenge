import axios from '@/axios';
import wrapAxios from './utils/axiosWrapper';

export default {
    strict: true,
    namespaced: true,
    state: {
        quoteToShow: {},
        visitedQuotes: {}
    },
    mutations: {
        setQuoteToShow(state, payload) {
            state.quoteToShow = payload;
        },
        visitQuote(state, payload) {
            state.visitedQuotes[payload.id] = true;
        }
    },
    actions: {
        showQuote({commit}, payload) {
            commit('setQuoteToShow', payload);
            commit('visitQuote', payload);
        },
        generateRandomQuote: wrapAxios(({dispatch, state}) => {
            return axios.get('/random', {params: {visited: state.visitedQuotes}}).then(res => {
                dispatch('showQuote', {...res.data, personalRating: 0})
            });
        }),
        upVoteQuote: wrapAxios((ctx, payload) => {
            return axios.post('/upvote', payload);
        }),
        fetchSimilarQuote: wrapAxios(({dispatch, state}, payload) => {
            return axios.get('/fetch/similar', {params: {...payload, visited: state.visitedQuotes}}).then(res => {
                dispatch('showQuote', res.data)
            });
        }),
        fetchDifferentQuote: wrapAxios(({dispatch, state}, payload) => {
            return axios.get('/fetch/different', {params: {...payload, visited: state.visitedQuotes}}).then(res => {
                dispatch('showQuote', res.data)
            });
        })
    },
}