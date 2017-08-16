const passport = require('koa-passport');

exports.get = async (ctx, next) => {
    await passport.authenticate('jwt')(ctx, next);

    if (!ctx.state.user) {
        ctx.status = 400;
        ctx.body = {error: 'invalid credentials'};
        return;
    }

    ctx.body = 'Hello, ' + ctx.state.user.nickname;
};
