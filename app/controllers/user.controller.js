const errorhandling = require('./error.controller');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sessionExp = 1000 * 60 * 60; //1 hours

exports.localLogin = (req, res) => {
    var user = Object.assign(req.user, {password: ''});
    res.json({
        loginSuccess: true,
        token: req.user._id,
        user: user,
        expired: sessionExp,
        message: ''
    });
};

exports.localLogout = (req, res) => {
    req.logout();
    req.session.destroy();
    delete req.user;
    res.redirect('/login');
};

exports.register = (db, req, res, next) => {
    var user = new db.user(req.body);
    user.save(function(err){
        if(err)
            return errorhandling.error500(res, err.message);
        req.login(user, (err)=>{
            var retuser = Object.assign( user, {password: ''});
            if(err)
                return next(err);
            return res.json({
                    loginSuccess: true,
                    token: req.user._id,
                    user: retuser,
                    expired: sessionExp,
                    message: ''
                });
        });
    });
};