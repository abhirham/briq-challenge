class CustomError extends Error {
    constructor(message, status){
        super();
        this.message=message;
        this.status = status;
    }
}

module.exports = {
    axiosWrapper: function(fn) {
        return function(req,res,next) {
            fn(req,res,next).catch(e => {
                next(e);
            })
        }
    },
    CustomError
}