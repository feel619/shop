const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('../public/openapi.json');

module.exports = function (app) {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Shop Express API",
                version: "0.1.0",
                description:
                    "Shop CRUD API application made with Express and documented with Swagger",
                license: {
                    name: "MIT",
                    url: "https://spdx.org/licenses/MIT.html",
                },
            },
            servers: [
                {
                    url: "http://localhost:2100",
                },
            ],
        },
        apis: ["./routes/*.js"],
    };
    const specs = swaggerJsdoc(options);
    // const hostname = window.location.hostname;
    // console.log(hostname);

    if (process.env.NODE_ENV === 'production') {
        swaggerDocument.servers[0].url = "http://localhost:2100/api/v1";
    }
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, { explorer: true })
    );
};