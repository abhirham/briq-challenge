const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const {CustomError, axiosWrapper} = require('./utils');
const morgan = require('morgan');
const topicApi = require('./topicTagging');
const {writeToFile, readFromFile} = require('./chacheToDisk');

app.use(cors());
app.use(express.json());

const quotesApi = axios.create({
    baseURL: "https://programming-quotes-api.herokuapp.com",
    timeout: 30000
});

let quotes = [];
let quotesTopics = readFromFile();

let promise = new Promise((resolve, reject) => {
    quotesApi.get('/quotes').then(res => {
        quotes = res.data;
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

app.get('/similar', async (req,res,next) => {
    try {
        let payload = req.query;
        payload.visited = JSON.parse(payload.visited);

        if(quotesTopics[payload.id] === undefined) {
            quotesTopics[payload.id] = await topicApi(payload.en);
        }
        let maxIdx = quotes.length-1;
        findSimilar(0);
    
        async function findSimilar(idx=0) {
            if(idx > maxIdx) return;
            let quote = quotes[idx];
            if(payload.visited[quote.id] !== undefined) {
                findSimilar(idx+1);
                return;
            }
            if(quotesTopics[quote.id] === undefined) {
                quotesTopics[quote.id] = await topicApi(quote.en);
            }
            let similar = quotesTopics[quote.id].some(topic => {
                return quotesTopics[payload.id].indexOf(topic) > -1
            });
            if(similar) {
                res.send(quote);
                writeToFile(quotesTopics);
                return;
            }
            findSimilar(idx+1);
        }
    } catch(e) {
        console.log(e.message)
        let err =  new CustomError('Something went wrong. Please try again later.', 500);
        next(err);
    }
});

app.post('/upvote', (req,res,next) => {
    return quotesApi.post('/quotes/vote', req.body).then(response => res.send(response.data)).catch(e => {throw new CustomError('Unable to upvote quote.', 500)});
});

app.use((err, req, res, next) => {
    res.status(err.status).send(err)
});

app.listen(3000, () => console.log('listening on port 3000'));