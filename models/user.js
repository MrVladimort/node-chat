const config = require('config');
const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        unique: "Имя уже используется",
        required: "Имя пользователя отсутствует"
    },
    email: {
        type: String,
        unique: "Такой email уже зарегестрирован",
        required: "E-mail пользователя не должен быть пустым.",
        validate: [
            {
                validator: function checkEmail(value) {
                    return this.deleted ? true : /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
                },
                msg: 'Укажите, пожалуйста, корректный email.'
            }
        ]
    },
    passwordHash: {
        type: String
    },
    salt: {
        type: String
    },

    token: {
        type: String
    },

    verifyEmailToken: {
        type: String,
        index: true
    },

    verifiedEmail: Boolean,

    providers: [{
        name: String,
        nameId: {
            type: String,
            index: true
        },
        profile: {} // for socials networks
    }]
}, {
    timeStamps: true
});

// создаем виртуальное поле которое будет существовать только при создании обьекта и нужно для преоброзования данных
userSchema.virtual('password')
    .set(function (password) {
        if (password !== undefined) { //проверка данных на наличие
            if (password.length < 4) {
                this.invalidate('password', 'Пароль должен быть минимум 4 символа');
            }
        }

        this._plainPassword = password;

        // создаем соль и хешируем пароль
        if (password) {
            this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations,
                config.crypto.hash.length, 'sha512');
        } else {
            // для ситуации регистрации без пароля (через соц сети)
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    })
    .get(function () {
        console.log('user.getPassword');
        return this._plainPassword;
    });

userSchema.methods.getPublicFields = function () {
    return {
        id: this.id,
        nickname: this.nickname,
        email: this.email
    }

};

// берем введенный пароль добавляем к нему соль взятую из пользователя, зешируем и сравниваем пароли
userSchema.methods.checkPassword = function (password) {
    console.log('user.checkPassword');
    if (!password) return false;
    if (!this.passwordHash) return false;


    const isOk = crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations,
        config.crypto.hash.length, 'sha512').toString() === this.passwordHash;

    console.log('isOk: ',isOk);
    return isOk;
};

module.exports = mongoose.model('User', userSchema);