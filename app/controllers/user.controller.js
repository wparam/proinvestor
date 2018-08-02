const errorhandling = require('./error.controller');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.localLogin = (req, res) => {
    req.session.curuser = req.user;
    // req.login(req.user, (err) => {
    //     let suc = {
    //         status: "SUCCESS",
    //         user: {
    //             name: req.user.name,
    //             token: req.user.token
    //         }
    //     };
    //     return res.json(suc);
    // });
    let suc = {
        status: 'SUCCESS',
        user: {
            name: req.user.name,
            token: req.user.token
        }
    };
    return res.json(suc);
};

exports.localLogout = (req, res) => {
    req.logout();
    req.session.destroy();
    delete req.user;
    // res.redirect('/#!/login');
    res.json({status: 'SUCCESS'});
};


exports.register = (db, req, res, next) => {
    if(req.body.password){
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    }
    var user = new db.user(req.body);
    user.save(function(err){
        if(err)
            return errorhandling.error500(res, err.message);
        res.send('Create User Success');
    });
};