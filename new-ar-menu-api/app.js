require('express-async-errors');
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
require('./startup/config')(app)
require('./startup/logging')(app)
require('./startup/validation');
require('./startup/db')()
require('./startup/routes')(app);

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Listening on port ${port}...`)}); 