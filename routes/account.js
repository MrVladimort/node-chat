const passport = require('koa-passport');

exports.get = async (ctx, next) => {
    await passport.authenticate('jwt', function (err, user) {
        if (user) {
            ctx.login(user);
            ctx.redirect('/');
        } else {
            ctx.flash('error', 'No such user or JWT is expired');
            console.log('err', err);
            ctx.redirect('/');
        }
    })(ctx, next);
};