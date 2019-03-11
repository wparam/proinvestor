const fs = require('fs');
const os = require('os');
const path = require('path');
module.exports = {
    loginUrl: '',
    sso:{
        entryPoint: 'http://sp:9090/openam/SSORedirect/metaAlias/idp',// Use the redirect option
        logoutUrl: 'http://sp:9090/openam/IDPSloRedirect/metaAlias/idp',
        privateCert: fs.readFileSync(path.join(__dirname, '../cert/jason.pem'), 'utf-8'), // Our SP private key that matches the public one.
        publicCert: fs.readFileSync(path.join(__dirname, '../cert/jason.cer'), 'utf-8'), //Our sp public key
        // decryptionPvk: fs.readFileSync(path.join(__dirname, '../cert/id_rsa'), 'utf-8'), //optional private key that will be used to attempt to decrypt any encrypted assertions that are received
        // decryptionCert: fs.readFileSync(path.join(__dirname, '../cert/id_rsa.pub'), 'utf-8'), //decryptionPvk is optional, but if decryptionPvk is provided, decryptionCert must be provided too
        callbackUrl: 'http://localhost:3000/api/auth/saml',
        path: '/api/auth/saml',
        cert: fs.readFileSync(path.join(__dirname, '../cert/ac.pub'), 'utf-8'),  // The public key from the IdP
        issuer: os.hostname() + '_saml2',  // The entity ID we used to register our SP with, no need to change this - and should not be changed after the metadata import
        identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        identifierElement: 'nameID',
        signatureAlgorithm: 'sha256',
        logoutCallbackUrl: 'http://localhost:3000/api/auth/saml/signoutResponse'
    }
};