const User = require('../models/user');
const path = require('path');
const config = require('config');
const jwt = require('jsonwebtoken');

exports.get = async function (ctx, next) {

    // ищем юзера с таким токеном взятого из url
    const user = await User.findOne({
        verifyEmailToken: ctx.params.verifyEmailToken
    });

    // если юзера не нашло и вообще ты злодюга
    if (!user) {
        ctx.throw(404, 'Ссылка подтверждения недействительна или устарела.');
    }

    if (!user.verifiedEmail) {
        user.verifiedEmail = true;
        await user.save();
    } else {
        ctx.throw(404, 'Изменений не произведено: ваш email уже верифицирован.');
    }

    const payload = {
        nickname: user.nickname,
        email: user.email
    };

    user.token = jwt.sign(payload, config.get('jwtSecret'), {expiresIn: '12h'});
    await user.save();

    await ctx.login(user);
    ctx.redirect('/');
};
