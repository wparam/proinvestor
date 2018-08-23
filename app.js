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
const coreCtrl = require('./app/controllers/core.controller');
const logger = require('logger');
const app = express(); 
const mongoose = require('mongoose');
const db = require('./app/models')(mongoose);
const passport = require('./config/passport')(db);
const authen = require('./app/controllers/authenticate.controller')();

const conn = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/asset_manager', {useNewUrlParser: true});

app.amMongoose = mongoose;
app.amModels = db;

conn.on('error', (err) => {
    logger.error(err.stack);
});

conn.once('open', () => {
    logger.info('DB connected');
});

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

const sessionExp = 1000 * 60 * 60; //1 hours
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

app.use((err, req, res, next) => {
    if(!err)
        next();
    res.status(err.status || 500).render('500', {
        message: err.message
    });
});

app.use((req, res, next) => {
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    res.status(404).render('404', {
        message: 'Resource not found'
    });
});

app.listen(config.port, () => {
    console.log(`listening on ${config.port}`);
});