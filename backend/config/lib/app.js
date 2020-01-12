
const chalk = require('chalk');
const config = require('../index');
const db = require('../../app/models');
const logger = require('./logger');
const express = require('./express');

process.on('unhandledRejection', (reason, p) => {
  console.log(chalk.red('Unhandled Rejection at: Promise', p));
  console.log(chalk.red(reason));
  console.log(reason);
});

process.on('warning', (warning) => {
  console.log(chalk.yellow(warning.stack));
});

const databaseAuthWrapper = async database =>{
  if(config.db.dialog === 'mongo'){
    return true;
  }
  if(config.db.dialog === 'mysql' && database.Sequelize &&  database instanceof database.Sequelize){
    return database.sequelize.authenticate();
  }
};

const _databaseCheck = database => {
  return databaseAuthWrapper()
    .then(() => {
      logger.info('Connection has been established successfully.');
      return true;
    })
    .catch(err => {
      logger.error(`Unable to connect to the database: ${err}`);
      return false;
    });
};

module.exports.start = async ()=>{
  let checkResult = await _databaseCheck(db);
  if(!checkResult){
    return false;
  }
  var app = express.init(db);
  app.listen(config.port, config.host, function () {
    var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
    logger.info('--');
    logger.info(chalk.green(config.app.title));
    logger.info();
    logger.info(chalk.green('Environment:     ' + process.env.NODE_ENV));
    logger.info(chalk.green('Server:          ' + server));
    logger.info(chalk.green('Database:        ' + config.db.uri));
    logger.info(chalk.green('App version:     ' + process.env.npm_package_version));
  });
};
