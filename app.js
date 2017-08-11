const Koa = require('koa');
const app = module.exports = new Koa();

const path = require('path');
const fs = require('fs');
const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function(middleware) {
    app.use(require('./middlewares/' + middleware));
});

app.use(async ctx => {
    ctx.body = 'Hello World!';
});