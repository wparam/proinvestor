const errorhandling = require('./error.controller');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.localLogin = (req, res) => {
    console.log(req.user);
    res.json({
        loginSuccess: true,
        token: req.user._id
    });
};

exports.localLogout = (req, res) => {
    req.logout();
    req.session.destroy();
    delete req.user;
    res.redirect('/login');
};


exports.register = (db, req, res, next) => {
    if(req.body.password){
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    }
    var user = new db.user(req.body);
    user.save(function(err){
        if(err)
            return errorhandling.error500(res, err.message);
        req.login(user, (err)=>{
            if(err)
                return next(err);
            return res.redirect('/dashboard');
        });
    });
};