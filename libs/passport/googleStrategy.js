const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../../models/user');
const config = require('config');
const authenticateByProfile = require('./authenticateByProfile');
const request = require('request-promise');

module.exports = new GoogleStrategy({
    clientID: config.providers.google.clientId,
    clientSecret: config.providers.google.clientSecret,
    //callbackURL: "http://localhost:3000/login/google/callback",
    callbackURL: config.server.siteHost + "/login/google/callback",
    profileFields: ['id', 'email', 'name', 'gender'],
    passReqToCallback: true
}, async function (req, accessToken, refreshToken, profile, done) {
    try {
        console.log(profile);
        let permissionError = null;
        /*facebook won't allow to use an email w/o verification
        user may allow authentication, but disable email access (e.g in fb)*/
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