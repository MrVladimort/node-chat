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
router.get('/private', require('./private').get);
router.get('/auth/vk', require('./vk').get);
router.get('/auth/google', require('./google').get);
router.get('/auth/facebook', require('./facebook').get);

module.exports = router.routes();