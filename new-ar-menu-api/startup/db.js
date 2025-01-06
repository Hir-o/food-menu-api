const mongoose = require('mongoose');
const logger = require('../middleware/logger');
const seedData = require('./seedData')

module.exports = function(){
    //mongoose.connect('mongodb://localhost/ar_menu_db')
    mongoose.connect(process.env.DB_URL).then(() => {
        logger.info('Connected to MongoDB ar_menu_db database...')
        seedData();
    });
}