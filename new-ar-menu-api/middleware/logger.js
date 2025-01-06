const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple()
      ),
      transports: [
        new winston.transports.Console({ colorize: true, prettyPrint: true }), // Log to the console
        new winston.transports.File({ filename: 'logs/combined.log' }), // Log to a file
        new winston.transports.MongoDB({ db: process.env.DB_URL, level: 'error' })
      ]
});

module.exports = logger;