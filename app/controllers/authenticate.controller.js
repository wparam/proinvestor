module.exports = () => {
    return (req, res, next) => {
        if(req.isAuthenticated()){
            next();
        }
        else{
            res.redirect('/login');
        }
    };
};