const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (db) => {
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done) => {
            db.findOne({username: username}, function(err, user){
                if (err) {
                    return done(err);
                } else if (!user) {
                    return done(null, false, 'User not found.');
                } else if(!bcrypt.compareSync(password, user.password)){
                    return done(null, false, 'Incorrect password');
                }
                return done(null, user);
            });
        }
    ));
};