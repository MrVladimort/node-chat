'use strict';

if (process.env.TRACE) {
    require('./libs/trace');
}

// точка запуска приложения
const app = require('./app');