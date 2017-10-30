const passport = require('passport');
const User = require('../../app/models/user.model');
const LocalStrategy = require('passport-local').Strategy;

module.exports = () => {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, (req, username, password, done) => {
            User.findUser(req, username, password, (err, user) => {
                if (err) {
                    return done(err);
                } else if (!user) {
                    var uerr = new Error('User not found.');
                    uerr.status = 401;
                    return done(uerr);
                }
                return done(null, user);
            });
        }
    ));
};