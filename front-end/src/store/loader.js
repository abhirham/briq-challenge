export default {
    strict: true,
    namespaced: true,
    state: {
        isLoading: [],
    },
    mutations: {
        setLoader(state, bool) {
            let newState = state.isLoading;
            if(bool === true) {
                state.isLoading = [...newState, true];
                return;
            }

            newState.pop();
            state.isLoading = newState;
        }
    }
}