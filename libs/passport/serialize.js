const User = require('../../models/user');
const passport = require('koa-passport');

// паспорт напрямую с базой не работает
passport.serializeUser(function (user, done) {
    console.log('serialize', user.id);
    done(null, user.id); // uses _id as idFieldd
});

passport.deserializeUser(function (id, done) {
    console.log('deserialize');
    User.findById(id, function(err,user) {
        err ? done(err) : done(null, user);
    }); // callback version checks id validity automatically
});
