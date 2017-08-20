const passport = require('koa-passport');

exports.get = async function (ctx, next) {
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true // req.flash
    })(ctx, next);
};