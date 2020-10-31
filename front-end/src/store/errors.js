export default {
    strict: true,
    namespaced: true,
    state: {
        error: '',
    },
    mutations: {
        setError(state, text) {
            state.error = text;
        }
    }
}