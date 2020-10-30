import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/axios';

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        quoteToShow: {},
        allQuotes: {},
        visitedQuotes: {},
        visitedSources: {},
        visitedAuthors: {},
    },
    mutations: {
        setQuoteToShow(state, payload) {
            state.quoteToShow = payload;
        },
        setAllQuotes(state, payload) {
            state.allQuotes = payload;
        },
        visitQuote(state, payload) {
            state.visitedQuotes[payload] = true;
        },
        visitSource(state, payload) {
            state.visitedSources[payload.author+payload.source] = true;
        },
        visitAuthor(state, payload) {
            state.visitedAuthors[payload] = true;
        }
    },
    actions: {
        generateRandomQuote({commit}) {
            axios.get('/random').then(res => commit('setQuoteToShow', {...res.data, personalRating: 0}));
        },
        upVoteQuote(ctx, payload) {
            return axios.post('/upvote', payload).then(console.log);
        },
        fetchSimilarQuote(ctx, payload){
            axios.get('/similar', {params: payload});
        },
        fetchAllQuotes({commit}) {
            axios.get('/quotes').then(res => res.data).then(res => {
                let obj = {};
                res.forEach(quote => {
                    if(quote.source === "" || quote.source === null) quote.source = "noSource";
                    let sources = quote.source.split(',');
                    if(!obj[quote.author]) obj[quote.author] = {};
                    sources.forEach(source => {
                        source = source.trim().replace(/"/g, '');
                        if(!obj[quote.author][source]) obj[quote.author][source] = {};
                        obj[quote.author][source][quote.id] = {...quote, formattedSource: source};
                    });
                });
                commit('setAllQuotes', obj);
            });
        }
    },
    modules: {
    }
})
