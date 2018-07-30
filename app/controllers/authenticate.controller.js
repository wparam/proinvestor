module.exports = () => {
    return (req, res, next) => {
        return next();
        if(req.isAuthenticated() && req.session.curuser && 
            req.session.curuser.name === req.user.name && 
            req.session.curuser.token === req.user.token){
            next();
        }
        else{
            res.redirect('/login');
        }
    };
};