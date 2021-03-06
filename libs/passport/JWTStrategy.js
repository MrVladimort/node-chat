const config = require('config');
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT
const User = require('../../models/user');

// Ждем JWT в Header
jwtOptions = {
    // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('jwtSecret')
};

module.exports = new JwtStrategy(jwtOptions, function (jwtPayload, done) {
    User.findOne({email: jwtPayload.email}, function (err, user) {
        if (err) {
            return done(err, false);
        }

        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    });
});
