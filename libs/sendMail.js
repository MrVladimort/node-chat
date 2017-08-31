'use strict';

const juice = require('juice');
const config = require('config');
const path = require('path');
const pug = require('pug');
const Letter = require('../models/letter');
const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const SMTPTransport = require('nodemailer-smtp-transport');

// создаем транспорт на основе наих данных из конфига
const transportEngine = new SMTPTransport({
        service: "Gmail",
        debug: true,
        auth: {
            user: config.mailer.gmail.user,
            pass: config.mailer.gmail.password
        }
    });

const transport = nodemailer.createTransport(transportEngine);

// переводим наш рендер в текст для анти спам системы
transport.use('compile', htmlToText());

module.exports = async function (options) {

    let message = {};

    let sender = config.mailer.senders['default'];
    if (!sender) {
        throw new Error("Unknown sender:" + options.from);
    }

    message.from = {
        nickname: sender.fromName,
        address: sender.fromEmail
    };

    // for template
    let locals = Object.create(options);

    locals.config = config;
    locals.sender = sender;

    message.html = pug.renderFile(path.join(config.template.root, 'email', options.template) + '.pug', locals);
    message.html = juice(message.html);

    message.to = (typeof options.to === 'string') ? {address: options.to} : options.to;

    if (process.env.MAILER_REDIRECT) {
        message.to = {address: sender.fromEmail};
    }

    if (!message.to.address) {
        throw new Error("No email for recepient, message options:" + JSON.stringify(options));
    }

    message.subject = options.subject;

    message.headers = options.headers;

    let transportResponse = await transport.sendMail(message);

    return await Letter.create({
        message,
        transportResponse,
        messageId: transportResponse.messageId
    });
};