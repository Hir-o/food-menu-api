const winston = require('winston');
const error = require('../middleware/error');

module.exports = function(app) {
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'logs/uncaughtExceptions.log' })
    );

    app.use(error);
}