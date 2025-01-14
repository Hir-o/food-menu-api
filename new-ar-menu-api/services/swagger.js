const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'AR Menu API',
    description: 'Api for AR Menu'
  },
  host: 'localhost:5000',
};

const outputFile = '../docs/swagger.json';
const routes = ['../startup/routes.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc).then(() => {
  require('../app.js'); // Your project's root file
});