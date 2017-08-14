'use strict';

if (process.env.TRACE) {
    require('./libs/trace');
}

const app = require('./app');