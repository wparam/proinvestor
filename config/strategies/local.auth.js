const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (db) => {
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done) => {
            db.find({userName: username, password: bcrypt.hashSync(password, saltRounds)}, function(err, user){
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