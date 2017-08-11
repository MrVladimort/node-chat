if (process.env.TRACE) {
    require('./libs/trace');
}

const app  = require('./app');
app.listen(3000);