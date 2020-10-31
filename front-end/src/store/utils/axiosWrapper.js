export default function wrapAxios(fn) {
    return function(ctx, payload) {
        ctx.commit('loaderModule/setLoader', true, { root: true });
        return fn(ctx, payload).catch(e => {
            let message = ((e.response || {}).data || {}).message;
            if(message === undefined) {
                message = e.message;
            }
            if(/timeout of [0-9]+ms exceeded|Network Error/.test(message)) {
                message = "Cannot connect to the server. Please try again later."
            }

            ctx.commit('errorsModule/setError', message, { root: true })
        }).finally(() => ctx.commit('loaderModule/setLoader', false, { root: true }))
    }
}