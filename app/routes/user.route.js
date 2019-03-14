const passport = require('passport');
const coreCtrl = require('../controllers/core.controller');
const userCtrl = require('../controllers/user.controller');
const { SAML } = require('passport-saml');
const bodyParser = require('body-parser');
const config = require('../../config');
// const authen = require('../controllers/authenticate.controller')();

module.exports = (app) => {
    app.get('/login', coreCtrl.index);
    app.post('/login', passport.authenticate('local'), userCtrl.localLogin);
    app.get('/logout', userCtrl.localLogout);
    app.post('/register', (req, res, next) => {
        return userCtrl.register(app.amModels, req, res, next);
    });


    app.post('/login/callback',  bodyParser.urlencoded({ extended: false }), passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
        function(req, res) {
            console.log('hit callback');
            res.redirect('/');
        }
    );

    app.get('/login/sso', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
        function(req, res) {
            res.redirect('/');
        }
    );

    app.get('/login/saml/meta', (req, res, next)=>{
        console.log(passport._strategy('saml').generateServiceProviderMetadata(config.sso.decryptionCert, config.sso.publicCert));
        res.set('Content-Type', 'text/xml');
        res.send(passport._strategy('saml').generateServiceProviderMetadata(config.sso.decryptionCert, config.sso.publicCert));
    }); 
};
