const Koa = require('koa');
const app = module.exports = new Koa();
const config = require('config');
const mongoose = require('./libs/mongoose');
const path = require('path');
const fs = require('fs');

app.proxy = true;
app.keys = [config.get('secret')];

// подключаем костяк нашего приложения
const handlers = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
handlers.forEach(handler => require('./middlewares/' + handler).init(app));

// TODO
/*const CSRF = require('koa-csrf');
app.use(new CSRF({
    invalidSessionSecretMessage: 'Invalid session secret',
    invalidSessionSecretStatusCode: 403,
    invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
  excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
  disableQuery: false
}));
*/
//----------------------------------------


// подключаем роуты
app.use(require('./routes'));

//запускаем прослушку сокета и запускаем сервер
const socket = require('./libs/socket');
const server = app.listen(config.port);
socket(server);
