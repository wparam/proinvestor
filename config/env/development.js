const fs = require('fs');
const os = require('os');
const path = require('path');
module.exports = {
    loginUrl: '/login/sso',
    sso:{
        entryPoint: 'http://sp:9090/openam/SSORedirect/metaAlias/investpro/idp',// Use the redirect option
        logoutUrl: 'http://sp:9090/openam/IDPSloRedirect/metaAlias/investpro/idp',
        privateCert: fs.readFileSync(path.join(__dirname, '../cert/jason.pem'), 'utf-8'), // Our SP private key that matches the public one.
        publicCert: fs.readFileSync(path.join(__dirname, '../cert/jason.cer'), 'utf-8'), //Our sp public key
        callbackUrl: 'http://localhost:3000/api/auth/saml',
        cert: fs.readFileSync(path.join(__dirname, '../cert/ac.pub'), 'utf-8'),  // The public key from the IdP
        issuer: os.hostname() + '_saml2',  // The entity ID we used to register our SP with, no need to change this - and should not be changed after the metadata import
        logoutCallbackUrl: 'http://localhost:3000/api/auth/saml/signoutResponse'
    }
};