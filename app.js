const Koa = require('koa');
const app = module.exports = new Koa();
const config = require('config');
const mongoose = require('./libs/mongoose');
const path = require('path');
const fs = require('fs');

app.proxy = true;
app.keys = [config.get('secret')];

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

app.use(require('./routes'));

//TODO
const socket = require('socket.io');
const socketioJwt = require('socketio-jwt');

const io = socket(app.listen(config.port));
io
    .on('connection', socketioJwt.authorize({
        secret: config.get('jwtSecret'),
        timeout: 15000
    }))
    .on('authenticated', function (socket) {

        console.log('Это мое имя из токена: ' + socket.decoded_token.nickname);

        socket.on("clientEvent", (data) => console.log(data));
    });
