const express = require('express');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const path = require('path');
const glob = require('glob');

const app = express();

app.use(favicon(path.join(__dirname, 'public/main/styles/img', 'favicon.ico')));

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, 'public')));

glob(path.join(__dirname, 'app/route/**/*.js'), (err, files) => {
    if(files.length === 0)
        return;
    files.map((f) => require(f)(app));
});
 
app.listen(4000, function(){ 
    console.log('listening on 4000');
});