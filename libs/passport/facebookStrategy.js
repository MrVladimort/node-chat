const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../../models/user');
const config = require('config');
const authenticateByProfile = require('./authenticateByProfile');
const request = require('request-promise');

module.exports = new FacebookStrategy({
        clientID: config.providers.facebook.appId,
        clientSecret: config.providers.facebook.appSecret,
        callbackURL: config.server.siteHost + "/login/facebook/callback",
        // https://developers.facebook.com/docs/graph-api/reference/v2.7/user
        profileFields: ['id', 'email', 'name', 'gender', 'locale'],
        passReqToCallback: true
    }, async function (req, accessToken, refreshToken, profile, done) {
        try {
            let permissionError = null;
            /*facebook won't allow to use an email w/o verification
            user may allow authentication, but disable email access (e.g in fb)*/
            if (!profile.emails || !profile.emails[0]) {
                permissionError = "При входе разрешите доступ к email";
            }

            if (permissionError) {
                // revoke facebook auth, so that next time facebook will ask it again (otherwise it won't)
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
    }
);
