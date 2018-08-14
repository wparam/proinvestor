const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (db) => {
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done) => {
            db.findOne({userName: username}, function(err, user){
                if (err) {
                    return done(err);
                } else if (!user) {
                    var uerr = new Error('User not found.');
                    uerr.status = 401;
                    return done(uerr);
                } else if(!bcrypt.compareSync(password, user.password)){
                    return done(new Error('Incorrect password'));
                }
                return done(null, user);
            });
        }
    ));
};