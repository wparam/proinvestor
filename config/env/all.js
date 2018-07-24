const path = require('path');
module.exports = {
    app:{},
    static: {
        js: ['public/**/*.js'],
        css: ['']
    },
    sessionSecret: 'cat',
    port: process.env.PORT || 4000,
    templateEngine: 'ejs',
    stockService: {
        certFile: path.join(__dirname, '../cert/iextrading.com.cert'),
        host: 'api.iextrading.com',
        prefix: '/1.0'
    },
};