const path = require('path');
const defer = require('config/defer').deferConfig;

module.exports = {
    server: {
        siteHost: 'http://localhost:3000'
    },
    //TODO
    providers: {
        facebook: {
            appId: '111447476189593',
            appSecret: '6fc58aa47656159350f768021ca1b81c',
            passportOptions: {
                display: 'popup',
                scope: ['email']
            }
        },

        vkontakte: {},
        google: {}
    },

    secret: 'PWNZsecret',

    jwtSecret: 'PWNZjwt',

    mongoose: {
        uri: 'mongodb://admin:admin@ds145750.mlab.com:45750/kek',
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1
                },
                poolSize: 5
            }
        }
    },

    mailer: {
        transport: 'gmail',
        gmail: {
            user: 'megachat.pwnz@gmail.com',
            password: 'megapassword'
        },
        senders: {
            default: {
                fromEmail: 'megachat.pwnz@gmail.com',
                fromName: 'Gravv',
                signature: "<em>С уважением,<br>Груви</em>"
            },
            // newsletters
            informer: {
                fromEmail: 'megachat.pwnz@gmail.com',
                fromName: 'Gravv',
                signature: "<em>Have fun!</em>"
            }
        }
    },

    port: process.env.PORT || 3000,

    template: {
        // template.root uses config.root
        root: defer(function (cfg) {
            return path.join(cfg.root, 'templates');
        })
    },

    crypto: {
        hash: {
            length: 64,
            // may be slow(!): iterations = 12000 take ~60ms to generate strong password
            iterations: process.env.NODE_ENV === 'production' ? 12000 : 1
        },
        salt: {
            length: 32
        }
    },

    root: process.cwd()
};