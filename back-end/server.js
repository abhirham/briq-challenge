const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const {CustomError, axiosWrapper} = require('./utils');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

const quotesApi = axios.create({
    baseURL: "https://programming-quotes-api.herokuapp.com",
    timeout: 10000
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
    }).catch(e => { 
        console.log(e.message);
        reject('Something went wrong at the server. Please try again later.');
    });
});

promise.catch(e => console.log(e));

app.get('/', axiosWrapper((req,res,next) => {
    return promise.then(response => res.json(quotes)).catch(e => {
        throw new CustomError(e, 500)
    });
}));

app.get('/ready', axiosWrapper((req,res,next) => {
    return promise.then(response => res.send(response)).catch(e => {throw new CustomError(e, 500)});
}));

app.get('/random', axiosWrapper((req,res,next) => {
    let visited = JSON.parse(req.query.visited);
    return findUnvisitedQuote();

    // making sure the random quote was not visited before.
    function findUnvisitedQuote() {
        return quotesApi.get('/quotes/random').then(response => {
            if(visited[response.data.id] === undefined){
                res.json(response.data);
                return;
            }
            findUnvisitedQuote();
        }).catch(e => {throw new CustomError('Unable to fetch random quote.', 500)});
    }
}));

app.get('/similar', (req,res,next) => {
    let payload = req.query;
    payload.visited = JSON.parse(payload.visited);
    let authorObj = quotes[payload.author];
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

    // search for unvisited quotes in the same author and source.
    findUnvisitedQuoteInSource(payload.author, payload.formattedSource);

    // search for unvisited quotes in the same author and different source if quoteToShow is still null.
    if(quoteToShow === null) {
        searchInSourceOf(payload.author);
    }

    // search in different authors
    if(quoteToShow === null) {
        Object.keys(quotes).some(author => {
            searchInSourceOf(author);
            return quoteToShow !== null;
        });
    }
    res.send(quoteToShow);

    function searchInSourceOf(author) {
        Object.keys(quotes[author]).some(source => {
            findUnvisitedQuoteInSource(author, source);
            return quoteToShow !== null;
        });
    }

    function findUnvisitedQuoteInSource(author, source) {
        Object.values(quotes[author][source]).some(quote => {
            if(payload.visited[quote.id] === undefined) {
                quoteToShow = quote;
            }
            return quoteToShow !== null;
        });
    }
});

app.post('/upvote', (req,res,next) => {
    return quotesApi.post('/quotes/vote', req.body).then(response => res.send(response.data)).catch(e => {throw new CustomError('Unable to upvote quote.', 500)});
});

app.use((err, req, res, next) => {
    res.status(err.status).send(err)
});

app.listen(3000, () => console.log('listening on port 3000'));