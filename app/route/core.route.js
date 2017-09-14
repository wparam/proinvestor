const express = require('express');
const route = express.Router();

module.exports = (app) => {
    app.get('/', (req, res, next) => {
        res.render('index', { title: 'AM', message: 'This is a test site'});
    });

    route.get('/s1', (req, res) => {
        console.log(req.baseUrl);
        console.log(req.app.mountpath);
        res.end('finish');
    });

    app.use('/test', route);
}
