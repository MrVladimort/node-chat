const config = require('config');
const jwt = require('jsonwebtoken');
const passport = require('koa-passport');

exports.get = async (ctx, next) => {
    ctx.body = ctx.render('login');
};

exports.post = async (ctx, next) => {
    //логин с получением JWT токена
    return passport.authenticate('local', async function (err, user, info) {
        if (err) throw err;

        if (!user) {
            ctx.flash('error', info.message);
            ctx.redirect('/');
        } else {
            const payload = {
                id: user.id,
                nickname: user.nickname,
                email: user.email
            };

            const token = jwt.sign(payload, config.get('jwtSecret'), {expiresIn: '12h'});

            ctx.response.token = token;

            /*ctx.body = {
                user: user.getPublicFields(),
                JWT: token
            };*/

            await ctx.login(user);
            ctx.redirect('/');
        }
    })(ctx, next);
};
