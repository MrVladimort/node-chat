const passport = require('koa-passport');
const config = require('config');
const {Strategy, ExtractJwt} = require('passport-jwt');

// Ждем JWT в Header
jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        secretOrKey: config.get('jwtSecret')
};

module.exports = new Strategy(jwtOptions, function (jwtPayload, done) {
    console.log(jwtPayload);
    User.findById(jwtPayload.id, function (err, user) {
        if (err) {
            return done(err, false);
        }

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    });
});
