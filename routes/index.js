const passport = require('koa-passport');
const config = require('config');
const Router = require('koa-router');
const router = new Router();

router.get('/', require('./frontPage').get);
router.post('/login', require('./login').post);
router.get('/login', require('./login').get);
router.get('/chat', require('./chat').get);
router.post('/logout', require('./logout').post);
router.post('/register', require('./register').post);
router.get('/register', require('./register').get);
router.get('/verify-email/:verifyEmailToken', require('./verifyEmail').get);
router.get('/account', require('./account').get);
router.get('/login/facebook', passport.authenticate('facebook', config.providers.facebook.passportOptions));
router.get('/login/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true // req.flash
}));

module.exports = router.routes();
