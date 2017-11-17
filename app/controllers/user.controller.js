
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