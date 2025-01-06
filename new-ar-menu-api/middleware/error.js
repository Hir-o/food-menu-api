const logger = require('./logger');

module.exports = function(ex, req, res, next){
    logger.error(ex.message, ex);
    res.status(500).send(ex.message);
}