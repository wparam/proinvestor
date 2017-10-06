const express = require('express');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const path = require('path');
const glob = require('glob');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config');
const engine = require('ejs-locals');
const app = express();
 
app.use(favicon(path.join(__dirname, 'public/main/styles/img', 'favicon.ico')));

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', config.templateEngine);
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(morgan('combined'));

app.use(express.static('public'));

glob(path.join(__dirname, 'app/route/**/*.js'), (err, files) => {
    if(files.length === 0)
        return;
    files.map((f) => require(f)(app));
});
 
app.listen(config.port, function(){ 
    console.log(`listening on ${config.port}`);
});