const passport = require('koa-passport');
const config = require('config');
const Router = require('koa-router');
const router = new Router();

router.get('/', require('./frontPage').get);
// router.post('/', require('./frontPage').post);

router.get('/files', require('./files').frontPage);
router.get('/files/:path', require('./files').get);
router.post('/files/:path', require('./files').post);
router.delete('/files/:path', require('./files').delete);

router.get('/login', require('./login').get);
router.post('/login', require('./login').post);

router.get('/chat', require('./chat').get);

router.get('/room', require('./room').frontPage);
router.get('/room/:id', require('./room').get);
router.post('/room/:id', require('./room').post);
router.delete('/room/:id', require('./room').delete);

router.get('/dialog', require('./dialog').frontPage);
router.get('/dialog/:id', require('./dialog').get);
router.post('/dialog/:id', require('./dialog').post);
router.delete('/dialog/:id', require('./dialog').delete);

router.post('/logout', require('./logout').post);

router.get('/register', require('./register').get);
router.post('/register', require('./register').post);

router.get('/verify-email/:verifyEmailToken', require('./verifyEmail').get);

router.get('/account', require('./account').get);


router.get('/login/facebook', passport.authenticate('facebook', config.passportOptions));
router.get('/login/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true // req.flash
}));

router.get('/login/google', passport.authenticate('google', config.passportOptions));
router.get('/login/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true // req.flash
}));

router.get('/login/vk', passport.authenticate('vkontakte', config.passportOptions));
router.get('/login/vk/callback', passport.authenticate('vkontakte', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true // req.flash
}));

module.exports = router.routes();
