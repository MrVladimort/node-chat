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
       nickname: ctx.request.body.nickname,
       password: ctx.request.body.password,
       verifiedEmail: false,
       verifyEmailToken: verifyEmailToken
    });


    try {
        await user.save();
    } catch (e) {
        if (e.name === 'ValidationError') {
            let errorMessages = "";
            for (let key in e.errors) {
                errorMessages += `${key}: ${e.errors[key].message}<br>`;
            }
            ctx.flash('error', errorMessages);
            ctx.redirect('/register');
            return;
        } else {
            ctx.throw(e);
        }
    }

    await sendMail({
        template: 'verify-registration-email',
        to: user.email,
        subject: "Подтверждение email",
        link: config.server.siteHost + '/verify-email/' + verifyEmailToken
    });

    ctx.body = 'Вы зарегистрированы. Пожалуйста, загляните в почтовый ящик, ' +
        'там письмо с Email-подтверждением.';
};