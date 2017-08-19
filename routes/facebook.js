const passport = require('koa-passport');
const config = require('config');

exports.get = async function(ctx, next) {
    console.log('lel');
    passport.authenticate('facebook', config.providers.facebook.passportOptions)(ctx, next);
};