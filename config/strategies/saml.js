const passport = require('passport');
const config = require('../index');
const SamlStrategy = require('passport-saml').Strategy;

module.exports = (db)=>{
    passport.use(new SamlStrategy(
    {
        assertionEncryption: config.sso.assertionEncryption,
        acceptedClockSkewMs: config.sso.acceptedClockSkewMs,
        signatureAlgorithm: config.sso.signatureAlgorithm,
        path: config.sso.path,
        entryPoint: config.sso.entryPoint,// Use the redirect option
        logoutUrl: config.sso.logoutUrl,
        logoutCallbackUrl: config.sso.logoutCallbackUrl,
        privateCert: config.sso.privateCert, // Our SP private key that matches the public one.
        // decryptionPvk: config.sso.decryptionPvk,
        // decryptionCert: config.sso.decryptionCert,
        callbackUrl: config.sso.callbackUrl,
        cert: config.sso.cert,  // The public key from the IdP
        issuer: config.sso.issuer,  // The entity ID we used to register our SP with
        identifierFormat: config.sso.identifierFormat,
        authnContext: config.sso.authnContext,
        disableRequestedAuthnContext: config.sso.disableRequestedAuthnContext
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