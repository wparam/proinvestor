const path = require('path');
module.exports = {
    app:{
        title: 'DHS AI',
        description: ''
    },
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    static: {
        js: ['public/**/*.js'],
        css: ['']
    },
    assets: {
        static:{
            maxAge: 24 * 60 * 60 * 1000
        },
        lib: {
            js: ['public/dist/*.js'],
            css: ['public/dist/*.css']
        }
    },
    domain: process.env.DOMAIN,
    sessionCookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sessionSecret: process.env.SESSION_SECRET || 'pro_sec',
        sessionKey: 'sessionId',
        sessionCollection: 'sessions'
    },
    favicon: 'assets/img/favicon.png',
    templateEngine: 'ejs',
    stockService: {
        certFile: path.join(__dirname, '../cert/iextrading.com.cert'),
        host: 'api.iextrading.com',
        prefix: '/1.0'
    }
};