const winston = require("winston");

module.exports = function (err, req, res, next) {
  winston.log("error", `catch Error ${err}`);
  res.status(200).send("internal server error");
};
