const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const winston = require("winston");
//app.io = require("socket.io")(server, { cors: { origin: "*" }, transports: ['websocket'] }); //for cors Domain
//global.io = app.io;

require("./startup/logging")();
//require("./startup/swagger")(app);
require("./startup/routes")(app);
//require("./startup/kafka");
require("./startup/config")();
require("./startup/mongodb")();
//require("./startup/netServer")(app.io, serverNet);

const hostname = '0.0.0.0';//27.54.182.230 0.0.0.0
const port = process.env.PORT || 3100;
const serverIO = server.listen(port, () => winston.log("info", `start server $${hostname}:${port}`));
module.exports = serverIO;
