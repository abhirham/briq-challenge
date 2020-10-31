export default function wrapAxios(fn) {
    return function(ctx, payload) {
        ctx.commit('loaderModule/setLoader', true, { root: true });
        return fn(ctx, payload).catch(e => {
            let message = e.response.data.message;
            if(message === undefined) {
                message = e.message;
            }
            ctx.commit('errorsModule/setError', message, { root: true })
        }).finally(() => ctx.commit('loaderModule/setLoader', false, { root: true }))
    }
}