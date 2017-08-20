const passport = require('koa-passport');

exports.get = async function(ctx, next) {
    passport.authenticate('facebook')(ctx, next);
};