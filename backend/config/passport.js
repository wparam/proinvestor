const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const glob = require('glob');

module.exports = (db) => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser((userId, done) => {
        if(!userId)
            done(new Error('User is empty'));
        db.user.findOne({_id: userId}, function(err, user){
            if(err)  return done(err);
            if (!user) {
                return done(null, false, 'User not found.');
            } 
            delete user.password;
            done(null, user);
        });
    });
    
    glob(path.join(__dirname, './strategies/*.js'), (err, files) => {
        if(files.length === 0)
            return;
        files.map((f) => require(f)(db.user));
    });

    return passport;
};