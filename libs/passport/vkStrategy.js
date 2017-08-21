const VkStrategy = require('passport-vkontakte').Strategy;
const config = require('config');
const authenticateByProfile = require('./authenticateByProfile');
const UserAuthError = require('./userAuthError');

module.exports = new VkStrategy({
    clientID: config.providers.vkontakte.clientId,
    clientSecret: config.providers.vkontakte.clientSecret,
    callbackURL: config.server.siteHost + "/login/vk/callback",
    //callbackURL: "http://localhost:3000/login/vk/callback",
    profileFields: ['id', 'email', 'name', 'gender'],
    passReqToCallback: true
}, async function (req, accessToken, refreshToken, params, profile, done) {
    try {
        profile.emails = [{value: params.email}];
        let permissionError = null;

        if (!profile.emails || !profile.emails[0]) {
            permissionError = "При входе разрешите доступ к email";
            throw new UserAuthError(permissionError);
        }

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
