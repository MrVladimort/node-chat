const passport = require('koa-passport');

exports.post = async function (ctx, next) {
    // запускает стратегию, станадартные опции что делать с результатом
    // можно передать и функцию
    console.log('login');
    await passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true // req.flash
    });
};
