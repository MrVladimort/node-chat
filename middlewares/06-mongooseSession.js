const session = require('koa-session');
const mongooseStorage = require('koa-session-mongoose');

options = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 3600 * 1e3,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. default is false **/

    //TODO
    // Use external session stores only if necessary, avoid uisng session as a cache,
    // keep the session lean, and store it in a cookie if possible!
    /*store: new mongooseStorage({
        collection: 'koaSessions',
        expires: 3600 * 1e3
    })*/
};

exports.init = app => app.use(session(options, app));
