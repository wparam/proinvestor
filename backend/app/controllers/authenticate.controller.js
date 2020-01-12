const config = require('../../config');
module.exports = () => {
    return (req, res, next) => {
        return next();
        if(req.isAuthenticated()){
            next();
        }
        else{
            if(config.loginUrl){
                return res.redirect(config.loginUrl);
            }
            res.redirect('/login');
        }
    };
};