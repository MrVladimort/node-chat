const User = require('../models/user');
const passport = require('koa-passport');
const sendMail = require('../libs/sendMail');
const config = require('config');

exports.get = async function (ctx) {
    ctx.body = ctx.render('register');
};

exports.post = async function (ctx) {
    const verifyEmailToken = Math.random().toString(36).slice(4, 14);
    const user = new User({
       email: ctx.request.body.email.toLowerCase(),
       nickname: ctx.request.body.nickname.toLowerCase(),
       password: ctx.request.body.password,
        // имейл не верифицирован
       verifiedEmail: false,
       verifyEmailToken: verifyEmailToken
    });


    try {
        await user.save();
    } catch (e) {
        // если мейл, никнейм уже ссущевтвуют
        if (e.nickname === 'ValidationError') {
            let errorMessages = "";
            // переносим данные о полях которые не проходят валидацию
            for (let key in e.errors) {
                errorMessages += `${key}: ${e.errors[key].message}<br>`;
            }
            // передаем флеш сообщение и начинаем регистрацию заново
            ctx.flash('error', errorMessages);
            ctx.redirect('/register');
            return;
        } else {
            // что-то не так?
            ctx.throw(e);
        }
    }

    // отправляем мейл с токеном уникальным токеном
    await sendMail({
        template: 'verify-registration-email',
        to: user.email,
        subject: "Подтверждение email",
        link: config.server.siteHost + '/verify-email/' + verifyEmailToken
    });

    // вывод сообщения
    ctx.body = 'Вы зарегистрированы. Пожалуйста, загляните в почтовый ящик, ' +
        'там письмо с Email-подтверждением.';
};