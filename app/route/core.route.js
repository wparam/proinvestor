const express = require('express');
const route = express.Router();

module.exports = (app) => {
    app.get('/', (req, res, next) => {
        res.render('index', { title: 'AM', message: 'This is a test site'});
    });
   
}
