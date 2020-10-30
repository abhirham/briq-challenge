import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/axios';

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        quoteToShow: {},
        allQuotes: {}
    },
    mutations: {
        setQuoteToShow(state, payload) {
            state.quoteToShow = payload;
        },
        setAllQuotes(state, payload) {
            state.allQuotes = payload;
        }
    },
    actions: {
        generateRandomQuote({commit}) {
            axios.get('/quotes/random').then(res => commit('setQuoteToShow', {...res.data, personalRating: 0}));
        },
        upVoteQuote(ctx, payload) {
            return axios.post('/quotes/vote', payload).then(console.log);
        },
        fetchSimilarQuote({state, commit}, payload){
            console.log(payload);
            let authorObj = state.allQuotes[payload.author];
            let quoteToShow = null;
            if(payload.source === undefined){
                Object.keys(authorObj).some(source => {
                    if(authorObj[source][payload.id] !== undefined) {
                        payload.source = source;
                        return true;
                    }
                    return false;
                })
            }

            authorObj[payload.source][payload.id].visited = true; // setting the visited to true so as to not show this quote again.
            
            // search for unisited quotes in the same source.
            findUnvisitedQuoteInSource(payload.source);

            // search for unisited quotes in the different source if quoteToShow is still null.
            if(quoteToShow === null) {
                Object.keys(authorObj).some(source => {
                    if(source !== payload.source) {
                        findUnvisitedQuoteInSource(source);
                    }
                    return quoteToShow !== null;
                })
            }

            function findUnvisitedQuoteInSource(source) {
                Object.values(authorObj[source]).some(quote => {
                    if(quote.visited === undefined) {
                        quoteToShow = quote;
                    }
                    return quoteToShow !== null;
                });
            }
        },
        fetchAllQuotes({commit}) {
            axios.get('/quotes').then(res => res.data).then(res => {
                let obj = {};
                res.forEach(quote => {
                    let sources = quote.source === "" || quote.source === null ? ['noSource'] : quote.source.split(',');
                    if(!obj[quote.author]) obj[quote.author] = {};
                    sources.forEach(source => {
                        source = source.trim().replace(/"/g, '');
                        if(!obj[quote.author][source]) obj[quote.author][source] = {};
                        obj[quote.author][source][quote.id] = quote;
                    });
                });
                commit('setAllQuotes', obj);
            });
        }
    },
    modules: {
    }
})
