const passport = require('koa-passport');

exports.get = async function(ctx, next) {
    if (ctx.isAuthenticated()) {
        ctx.redirect('/chat');
    } else {
        ctx.redirect('/login');
    }
    //ctx.body = ctx.render('frontPage');
};

exports.post = async function (ctx, next) {
    await passport.authenticate('jwt', function (err, user) {
        if (user) {
            ctx.body = "hello " + user.nickname;
        } else {
            ctx.body = "No such user";
            console.log("err", err)
        }
        ctx.login(user);
        ctx.redirect('/chat');
    })(ctx, next);
};
