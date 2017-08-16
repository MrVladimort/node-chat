const config = require('config');
const jwt = require('jsonwebtoken');
const passport = require('koa-passport');

exports.post = async function(ctx, next) {
    await passport.authenticate('local')(ctx, next);

    if (ctx.state.user) {
        const payload = {
            id: ctx.state.user._id,
            nickname: ctx.state.user.nickname,
            email: ctx.state.user.email
        };

        const token = jwt.sign(payload, config.jwtSecret);

        ctx.body = {token};

    } else {
        ctx.status = 400;
        ctx.body = {error: "Invalid credentials"};
    }
};
