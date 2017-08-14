const Koa = require('koa');
const config = require('config');
const app = module.exports = new Koa();
const mongoose = require('./libs/mongoose');
const path = require('path');
const fs = require('fs');

const socket = require('socket.io');

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function(middleware) { app.use(require('./middlewares/' + middleware)); });
//----------------------------------------
const Router = require('koa-router');
const router = new Router();

router.get('/', require('./routes/frontPage').get);
router.post('/login', require('./routes/login').post);
//router.post('/logout', require('./routes/logout').post);
router.post('/register', require('./routes/register').post);
router.get('/register', require('./routes/register').get);
router.get('/verify-email/:verifyEmailToken', require('./routes/verifyEmail').get);

app.use(router.routes());

socket(app.listen(config.port));