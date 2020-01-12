const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const appRoot = process.cwd();

const custFormat = printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

const Logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        custFormat
    ),
    timestamp: function () {
        return new Date()
    },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        //
        new transports.File({ filename: path.join(appRoot, 'log', 'logger_error.log'), level: 'error' }),
        new transports.File({ filename: path.join(appRoot, 'log', 'logger_combined.log') })
    ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
    Logger.add(new transports.Console({
        format: custFormat,
        timestamp: true
    }));
}

module.exports = Logger;