const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authen = require('../controllers/authenticate.controller')();

module.exports = (app) => {
    // app.post('/login', passport.authenticate('local'), userCtrl.localLogin);
    // app.get('/logout', userCtrl.localLogout);
    app.post('/register', (req, res, next) => {
        return userCtrl.register(app.amModels, req, res, next);
    });
};
