const helmet = require('helmet');
const cors = require('cors');
const swaggerUi= require("swagger-ui-express");
const fs = require("fs");

module.exports = function(app){
    app.use(helmet());
    app.use(cors());

    if (fs.existsSync("./docs/swagger.json")) {
        const swaggerDocument = require("../docs/swagger.json");
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
    
    if (!process.env.JWT_KEY){
        throw new Exception("FATAL ERROR: JWT_KEY is not defined!");
    }
}