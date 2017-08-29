const mongoose = require('../libs/mongoose');
const session = require('koa-generic-session');
const convert = require('koa-convert');



options = {
    key: 'sid', /*(string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 3600,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. default is false **/

    store: require('../libs/sessionStore')
};

exports.init = app => app.use(convert(session(options, app)));
