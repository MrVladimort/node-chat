const passport = require('koa-passport');

exports.get = async (ctx, next) => {
    await passport.authenticate('jwt', function (err, user) {
        if (user) {
            ctx.body = "hello " + user.nickname;
        } else {
            ctx.body = "No such user";
            console.log("err", err)
        }
        ctx.login(user);
        ctx.redirect('/');
    })(ctx, next);
};