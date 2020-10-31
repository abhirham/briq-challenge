const axios = require('axios');

const topicApi = axios.create({
    baseURL: "https://twinword-topic-tagging.p.rapidapi.com/generate",
    timeout: 10000,
    headers: {
        "x-rapidapi-host": "twinword-topic-tagging.p.rapidapi.com",
        "x-rapidapi-key": "dbb4bf03c4msh7371a14553a5d7ep1a3dfajsnf112f1e0bcb1",
        "useQueryString": true
    }
})

module.exports = function fetchTopic(text) {
    return topicApi.get('/', {params: {text}}).then(res => Object.keys(res.data.topic));
}