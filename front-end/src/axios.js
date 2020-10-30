import axios from 'axios';

const api = axios.create({
    baseURL: "https://programming-quotes-api.herokuapp.com",
});

export default api;