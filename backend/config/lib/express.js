const express = require('express');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const path = require('path');
const glob = require('glob');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const helmet = require('helmet');
const engine = require('ejs-locals')
const logger = require('./logger');
const app = express();
const config = require('../index');

const ENV = process.env.NODE_ENV;

module.exports.initLocalVariables = function (app) {
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.jsFiles = config.getJavaScriptAssets();
  app.locals.cssFiles = config.getCssAssets();
  app.locals.favicon = config.favicon;
  app.locals.viewEngine = config.templateEngine;
  app.locals.env = process.env.NODE_ENV;

  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

module.exports.initMiddleware = function (app) {
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  app.use(favicon(app.locals.favicon));

  app.use(morgan('combined'));

  if (ENV === 'development') {
    app.set('view cache', false);
  } else if (ENV === 'production') {
    app.locals.cache = 'memory';
  }

  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }));
  app.use(bodyParser.json({ limit: '50mb' }));

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
};

module.exports.initViewEngine = function (app) {
  app.engine('ejs', engine);
  app.set('views', path.resolve('./app/views'));
  app.set('view engine', app.locals.viewEngine);
};

module.exports.initHelmetHeaders = function (app) {
  // six months expiration period specified in seconds
  var SIX_MONTHS = 15778476;

  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubDomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

module.exports.initSession = function (app, db) {
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionCookie.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl
    },
    name: config.sessionCookie.sessionKey,
    store: new SequelizeStore({ db: db.sequelize, table: 'Session' })
  }));

};

module.exports.initPassport = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports.initClientStatic = function (app) {
  app.use(express.static(path.resolve('./public'), { maxAge: config.assets.static.maxAge }));
};

module.exports.initServerRoutes = function (app) {
  glob.sync(path.resolve('./app/routes/*.route.js')).forEach((routePath) => {
    require(path.resolve(routePath))(app);
  });
};

module.exports.initErrorRoutes = function (app) {
  app.use(function (err, req, res, next) {
    if (!err) {
      return next();
    }
    logger.error(err.stack);
    res.redirect('/server-error'); //todo, add view
  });
};

module.exports.init = function (db) {
  // Initialize express app
  var app = express();
  
  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express view engine
  this.initViewEngine(app);
  
  // Initialize Helmet security headers
  this.initHelmetHeaders(app);
  
  // Initialize Express session
  // this.initSession(app, db);

  // Initialize Passport
  // this.initPassport(app);
  
  // Initialize ClientStatic
  this.initClientStatic(app);

  // Initialize modules server routes
  this.initServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);
  
  
  return app;
};
