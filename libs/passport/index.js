const passport = require('koa-passport');

require('./serialize');

passport.use(require('./localStrategy'));
passport.use('jwt', require('./JWTStrategy'));

module.exports = passport;
