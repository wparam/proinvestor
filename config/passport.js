const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user.model');
const path = require('path');
const glob = require('glob');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    if(!user)
        done(new Error('User is empty'));
    done(null, user);
});

glob(path.join(__dirname, './strategies/*.js'), (err, files) => {
    if(files.length === 0)
        return;
    files.map((f) => require(f)());
});

module.exports = passport;