const path = require('path');
const defer = require('config/defer').deferConfig;

module.exports = {

    // url сервера
    server: {
        siteHost: 'https://megachat-pwnz.herokuapp.com'
    },

    // настройки пасспорта, то что мы должны обязательно получать с сервера внешних систем для аутентификации
    passportOptions: {
        display: 'popup',
        scope: ['email']
    },

    // ключи регистрации приложения в системах
    providers: {
        facebook: {
            clientId: '111447476189593',
            clientSecret: '6fc58aa47656159350f768021ca1b81c'
        },

        google: {
            clientId: '164502065939-qrltjdkmdcajj2tmqtpc97051q56olcq.apps.googleusercontent.com',
            clientSecret: 'jbfZGmmJ5IHymGJP0xiggu3G'
        },

        vkontakte: {
            clientId: '6155864',
            clientSecret: 'LSjQBNrsb2ltf7UMn0oc'
        }
    },

    // секрет для печенек)
    secret: 'PWNZsecret',

    // секрет для подписания JWT
    jwtSecret: 'PWNZjwt',

    // настройки для подключения датабазы
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

    // настройки отправки сообщений
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
            }
        }
    },

    // порт для прослушки приложением
    port: process.env.PORT || 3000,

    // задаем root для темплейтов
    template: {
        root: defer(function (cfg) {
            return path.join(cfg.root, 'templates');
        })
    },

    // настройки хеширования паролей
    crypto: {
        hash: {
            length: 64,
            // может занять примерно 60мс для генерирования длинного пароля
            iterations: 12000
        },
        salt: {
            length: 32
        }
    },

    root: process.cwd()
};