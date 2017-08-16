const passport = require('koa-passport');
const config = require('config');
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT
const User = require('../../models/user')

// Ждем JWT в Header
jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    //jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.get('jwtSecret')
};

module.exports = new JwtStrategy(jwtOptions, function (jwtPayload, done) {
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
