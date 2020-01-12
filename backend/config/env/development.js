const fs = require('fs');
const os = require('os');
const path = require('path');
module.exports = {
    secure: {
        ssl: true,
        privateKey: './config/development/key.pem',
        certificate: './config/development/cert.pem'
    },
    db:{
        dialog: 'mongo',
        uri: 'mongodb://localhost:27017/pro_investor',
        host: 'localhost',
        port: 3306,
        schema: 'proui',
        username: 'proui',
        password: 'proui'
    },
    sso:{
        entryPoint: 'http://sp:9090/openam/SSORedirect/metaAlias/idp',// Use the redirect option
        logoutUrl: 'http://sp:9090/openam/IDPSloRedirect/metaAlias/idp',
        privateCert: fs.readFileSync(path.join(__dirname, '../cert/jason.pem'), 'utf-8'), // Our SP private key that matches the public one.
        publicCert: fs.readFileSync(path.join(__dirname, '../cert/jason.cer'), 'utf-8'), //Our sp public key
        callbackUrl: 'http://localhost:3000/api/auth/saml',
        cert: fs.readFileSync(path.join(__dirname, '../cert/am.cer'), 'utf-8'),  // The public key from the IdP
        issuer: os.hostname() + '_saml2',  // The entity ID we used to register our SP with, no need to change this - and should not be changed after the metadata import
        logoutCallbackUrl: 'http://localhost:3000/api/auth/saml/signoutResponse',
        decryptionPvk: fs.readFileSync(path.join(__dirname, '../cert/jason.pem'), 'utf-8'),
        decryptionCert: fs.readFileSync(path.join(__dirname, '../cert/jason.cer'), 'utf-8'),
        // identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        // identifierElement: 'nameID',
        signatureAlgorithm: 'sha256'
    }
};