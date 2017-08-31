const express = require('express');
const path = require('path');


const app = express();

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

app.get('/', function(req, res){
    res.render('index', {title:'assetmanager', message: 'Hello, Asset Manager'});
});

app.listen(4000, function(){ 
    console.log('listening on 4000');
});