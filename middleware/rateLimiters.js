//Services
const RateLimiter = require('express-rate-limit');

module.exports = {

    AccountLimiter: RateLimiter({
        windowMs: 60 * 1000,
        max: 5,
        handler: (req, res, next) => {
            const ErrorObj = new Error('Too many authentication requests.  Try again later.');
            ErrorObj.status = 429;
            return next(ErrorObj);
        },
    }),

}