const passport = require('koa-passport');
const config = require('config');

exports.get = async function(ctx, next) {
    passport.authenticate('facebook', config.providers.facebook.passportOptions)(ctx, next);
};