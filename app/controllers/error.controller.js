const logger = require('logger');

exports.error404 = (res, message='')=>{
    logger.error(`404 error happen in server, with message:${message}`);
    res.status(404).send(message);
};

exports.error400 = (res, message='')=>{
    logger.error(`400 error happen in server, with message: ${message}`);
    res.status(400).send(message);
};

exports.error500 = (res, message='')=>{
    logger.error(`500 error happen in server, with message: ${message}`);
    res.status(500).send(message);
};