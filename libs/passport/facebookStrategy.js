const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('config');
const authenticateByProfile = require('./authenticateByProfile');
const request = require('request-promise');
const UserAuthError = require('./userAuthError');


module.exports = new FacebookStrategy({
    clientID: config.providers.facebook.clientId,
    clientSecret: config.providers.facebook.clientSecret,
    // куда отправить данные
    callbackURL: config.server.siteHost + "/login/facebook/callback",
    // что хотим от соц сети
    profileFields: ['id', 'email', 'name', 'gender'],
    // отправить ли в коллбек?
    passReqToCallback: true
}, async function (req, accessToken, refreshToken, profile, done) {
    try {
        let permissionError = null;

        // мог вернутся профайл но пользователь не разрешил передачу имейла
        if (!profile.emails || !profile.emails[0]) {
            permissionError = "При входе разрешите доступ к email";
        }

        if (permissionError) {
            // возможность повторной верификации (грубо говоря удаление сессии на аутентификацию)
            let response = await request({
                method: 'DELETE',
                json: true,
                url: "https://graph.facebook.com/me/permissions?access_token=" + accessToken
            });

            if (!response.success) {
                throw new Error("Facebook auth delete call returned invalid result " + response);
            }

            throw new UserAuthError(permissionError);
        }


        //задем имя из Имени и Фамилии
        profile.name = profile.name.givenName + " " + profile.name.familyName;

        authenticateByProfile(req, profile, done);

    } catch (err) {
        console.log(err);
        if (err instanceof UserAuthError) {
            done(null, false, {message: err.message});
        } else {
            done(err);
        }
    }
});
