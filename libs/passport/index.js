const passport = require('koa-passport');
const User = require('../../models/user');

passport.use(require('./localStrategy'));
passport.use(require('./JWTStrategy'));
passport.use(require('./facebookStrategy'));
/*passport.use(require('./googleStrategy'));
passport.use(require('./vkStrategy'));*/

// паспорт напрямую с базой не работает
passport.serializeUser(function (user, done) {
    console.log('serialize', user.email);
    done(null, user.email); // uses _id as idFieldd
});

passport.deserializeUser(function (email, done) {
    console.log('deserialize');
    User.findOne({email: email}, function(err,user) {
        err ? done(err) : done(null, user);
    }); // callback version checks id validity automatically
});


module.exports = passport;
