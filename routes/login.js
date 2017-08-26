const config = require('config');
const jwt = require('jsonwebtoken');
const passport = require('koa-passport');

exports.get = async (ctx, next) => {
    ctx.body = ctx.render('login');
};

exports.post = async (ctx, next) => {
    //логин с получением JWT токена
    await passport.authenticate('local', async function (err, user, info) {
        if (err) throw err;

        if (!user) {
            ctx.flash('error', info.message);
            ctx.redirect('/');
        } else {
            const payload = {
                nickname: user.nickname,
                email: user.email
            };

            const token = jwt.sign(payload, config.get('jwtSecret'), {expiresIn: '12h'});

            user.token = token;
            await user.save();

            await ctx.login(user);

            ctx.redirect('/');
        }
    })(ctx, next);
};
