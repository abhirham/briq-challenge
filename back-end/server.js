const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const quotesApi = axios.create({
    baseURL: "https://programming-quotes-api.herokuapp.com",
});

const quotes = {};

let promise = new Promise((resolve, reject) => {
    quotesApi.get('/quotes').then(res => {
        res.data.forEach(quote => {
            if(quote.source === "" || quote.source === null) quote.source = "noSource";
            let sources = quote.source.split(',');
            if(!quotes[quote.author]) quotes[quote.author] = {};
            sources.forEach(source => {
                source = source.trim().replace(/"/g, '');
                if(!quotes[quote.author][source]) quotes[quote.author][source] = {};
                quotes[quote.author][source][quote.id] = {...quote, formattedSource: source};
            });
        });

        resolve(true);
    });
});

app.get('/', (req,res,next) => {
    promise.then(response => res.json(quotes))
});

app.get('/ready', (req,res,next) => {
    promise.then(response => res.send(response))
});

app.get('/random', (req,res,next) => {
    quotesApi.get('/quotes/random').then(response => {
        res.json(response.data);
    }).catch(console.log);
});

app.get('/similar', (req,res,next) => {
    // quotesApi.get('/quotes/random').then(response => res.send(response.data)).catch(console.log);
    console.log(req.query)
    let newState = state.allQuotes;
    let authorObj = newState[payload.author];
    let quoteToShow = null;
    
    if(payload.formattedSource === undefined){
        Object.keys(authorObj).some(source => {
            if(authorObj[source][payload.id] !== undefined) {
                payload.formattedSource = source;
                return true;
            }
            return false;
        })
    }

    commit('visitQuote', payload.id); // setting the visited to true so as to not show this quote again.

    // search for unvisited quotes in the same author and source.
    findUnvisitedQuoteInSource(payload.author, payload.formattedSource);

    // search for unvisited quotes in the same author and different source if quoteToShow is still null.
    if(quoteToShow === null) {
        searchInSourceOf(payload.author);
    }

    // search in different authors
    if(quoteToShow === null) {
        Object.keys(newState).some(author => {
            if(state.visitedAuthors[author] === undefined) {
                searchInSourceOf(author);
            }
            return quoteToShow !== null;
        });
    }
    commit('setQuoteToShow', quoteToShow);

    function searchInSourceOf(author) {
        Object.keys(newState[author]).some(source => {
            if(state.visitedSources[source] === undefined) {
                findUnvisitedQuoteInSource(author, source);
            }
            return quoteToShow !== null;
        });

        if(quoteToShow === null) {
            commit('visitAuthor', author);
        }
    }

    function findUnvisitedQuoteInSource(author, source) {
        console.log(author, source)
        Object.values(newState[author][source]).some(quote => {
            if(state.visitedQuotes[quote.id] === undefined) {
                quoteToShow = quote;
            }
            return quoteToShow !== null;
        });

        if(quoteToShow === null) {
            commit('visitSource', {author, source});
        }
    }
});

app.post('/upvote', (req,res,next) => {
    quotesApi.post('/quotes/vote', req.body).then(response => res.send(response.data));
});

app.listen(3000, () => console.log('listening on port 3000'));