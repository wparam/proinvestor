const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
// const authen = require('../controllers/authenticate.controller')();

module.exports = (app) => {
    app.post('/login', passport.authenticate('local', { successRedirect: '/',  failureRedirect: '/login' }));
    app.post('/logout', userCtrl.localLogout);
    app.post('/register', (req, res, next) => {
        return userCtrl.register(app.amModels, req, res, next);
    });
};
