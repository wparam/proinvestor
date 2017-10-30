const express = require('express');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const path = require('path');
const async = require('async');
const glob = require('glob');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config');
const ejs = require('ejs');
const helmet = require('helmet');
const flash = require('connect-flash');
const engine = require('ejs-locals');
const session = require('express-session');
const passport = require('./config/passport');
const coreCtrl = require('./app/controllers/core.controller');
const app = express(); 

const env = process.env.NODE_ENV || 'development';

app.use((req, res, next) => {
    res.locals.url = req.protocol + '://' + req.headers.host + req.url;
    next();
});

app.use(favicon(path.join(__dirname, 'public/resource/img', 'favicon.png')));

//for all authenticate users
app.locals.users = [];

app.set('showStackError', true);
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', config.templateEngine);

app.use(morgan('combined'));

const setCustomCacheControl = (res, path) => {
    const mitype = express.static.mime.lookup(path);
    if (mitype === 'text/html' || mitype === 'image/png') {
        res.setHeader('Cache-Control', 'public, max-age=600');
    }
};

if (env !== 'development') {
    app.use(express.static(path.resolve('public'), {
        maxAge: 31557600000,
        setHeaders: setCustomCacheControl
    }));
} else {
    app.use(express.static(path.resolve('public')));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const sessionExp = 1000 * 60 * 60 * 24; //24 hours
app.use(session({
    secret: config.sessionSecret,
    cookie: {
        secure: false,
        expires: new Date(Date.now() + sessionExp), // plus 6 hour
        maxAge: sessionExp
    },
    resave: true,
    rolling: true,
    saveUninitialized: true
}));

app.disable('x-powered-by');

app.use(helmet());

app.use(passport.initialize());

app.use(passport.session());

glob.sync(path.join(__dirname, 'app/routes/**/*.js')).forEach((routePath) => {
    require(path.resolve(routePath))(app);
});

app.get('*', coreCtrl.index);

app.use((err, req, res, next) => {
    if(!err)
        next();
    res.status(err.status || 500);
    res.send(err.message);
});

app.use((req, res, next) => {
    var err = new Error('Not Found Resource: ' + req.url);
    err.status = 404;
    next(err);
});

app.listen(config.port, () => {
    console.log(`listening on ${config.port}`);
});