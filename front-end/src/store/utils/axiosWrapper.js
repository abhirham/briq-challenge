export default function wrapAxios(fn) {
    return function(ctx, payload) {
        ctx.commit('loaderModule/setLoader', true, { root: true });
        fn(ctx, payload).catch(e => {
            console.log(e.response.data);
            ctx.commit('errorsModule/setError', e.message, { root: true })
        }).finally(() => ctx.commit('loaderModule/setLoader', false, { root: true }))
    }
}