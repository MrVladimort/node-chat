const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');

function makeProviderId(profile) {
    return profile.provider + ":" + profile.id;
}

module.exports = async function (req, profile, done) {
    // вернувшийся профайл пользователя
    const userToConnect = req.user;

    const providerNameId = makeProviderId(profile);   // "facebook:123456"

    let user;

    if (userToConnect) {
        // ищем уже зарегестрированного пользователя
        const alreadyConnectedUser = await User.findOne({
            "providers.nameId": providerNameId,
            _id: {$ne: userToConnect._id}
        });

        // если такой пользователь существует мы просматривам его на то существует ли у него уже подключенный провайдер
        // так как мы не знаем как изменились данные и не хотим проходить по всему профайлу
        // мы просто удаляем старый и записываем новый
        if (alreadyConnectedUser) {
            for (let i = 0; i < alreadyConnectedUser.providers.length; i++) {
                const provider = alreadyConnectedUser.providers[i];
                if (provider.nameId === providerNameId) {
                    provider.remove();
                    i--;
                }
            }
            await alreadyConnectedUser.save();
        }

        user = userToConnect;

    } else {
        user = await User.findOne({"providers.nameId": providerNameId});

        if (!user) {
            // если пользователь с таким имейлом уже существует а профайла от этой сети еще нет
            user = await User.findOne({email: profile.emails[0].value});

            if (!user) {
                // auto-register
                user = new User();
            }
        }
    }

    mergeProfile(user, profile);

    try {
        await user.save();
        done(null, user);
    } catch (err) {
        done(null, false, {message: "Недостаточно данных или имя зарегестрированно на другой Email"});
    }
};

function mergeProfile(user, profile) {
    if (!user.email && profile.emails && profile.emails.length) {
        user.email = profile.emails[0].value; // может быть много имейлов мы берем первый и основной
    }

    if (!user.nickname && profile.name) {
        user.nickname = profile.name;
    }

    // remove previous profile from the same provider, replace by the new one
    const nameId = makeProviderId(profile);
    for (let i = 0; i < user.providers.length; i++) {
        const provider = user.providers[i];
        if (provider.nameId === nameId) {
            provider.remove();
            i--;
        }
    }

    user.providers.push({
        name: profile.provider,
        nameId: makeProviderId(profile),
        profile: {
            name: profile.name,
            email: profile.emails[0],
            gender: profile.gender
        }
    });

    user.verifiedEmail = true;

    const payload = {
        nickname: user.nickname,
        email: user.email
    };

    user.token = jwt.sign(payload, config.get('jwtSecret'), {expiresIn: '12h'});
}
