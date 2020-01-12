const passport = require('passport');
const config = require('../index');
const SamlStrategy = require('passport-saml').Strategy;

module.exports = (db)=>{
    passport.use(new SamlStrategy(
    {
        entryPoint: config.sso.entryPoint,// Use the redirect option
        logoutUrl: config.sso.logoutUrl,
        logoutCallbackUrl: config.sso.logoutCallbackUrl,
        privateCert: config.sso.privateCert, // Our SP private key that matches the public one.
        callbackUrl: config.sso.callbackUrl,
        cert: config.sso.cert,  // The public key from the IdP
        issuer: config.sso.issuer,  // The entity ID we used to register our SP with
        decryptionPvk: config.sso.decryptionPvk,
        decryptionCert: config.sso.decryptionCert,
        // identifierFormat: config.sso.identifierFormat,
        signatureAlgorithm: config.sso.signatureAlgorithm
    },
    function(profile, done) {
        console.log(profile);
    })
        // findByEmail(profile.email, function(err, user) {
        //     if (err) {
        //         return done(err);
        //     }
        //     return done(null, user);
        //     });
        // })
    );
    return passport;
}