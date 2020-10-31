import moment from 'moment';

export default {
    strict: true,
    namespaced: true,
    state: {
        errors: {},
    },
    getters: {
        errors(state) {
            return Object.values(state.errors);
        }
    },
    mutations: {
        addError(state, text) {
            let timeStamp = moment().unix();
            state.errors = {...state.errors, [timeStamp]: {timeStamp, text}};
        },
        removeError(state, ts) {
            let newState = {...state.errors};
            delete newState[ts];
            state.errors = newState;
        }
    }
}