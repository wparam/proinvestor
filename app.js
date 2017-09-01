const express = require('express');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const path = require('path');


const app = express();

app.use(favicon(path.join(__dirname, 'public/main/styles/img', 'favicon.ico')));

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('index', {title:'assetmanager', message: 'Hello, Asset Manager'});
});

app.listen(4000, function(){ 
    console.log('listening on 4000');
});