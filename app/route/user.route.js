const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authen = require('../controllers/authen.controller')();

module.exports = (app) => {
    app.post('/login', passport.authenticate('local'), userCtrl.localLogin);
    app.get('/logout', userCtrl.localLogout);
};
