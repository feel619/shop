require("express-async-errors");
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
const winston = require("winston");
//const { createLogger, format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const transport = new DailyRotateFile({
  filename: 'log/combinedLogs%DATE%.log',
  datePattern: 'YYYY_MM_DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '1d',
  prepend: true,
  level: 'verbose',
  options: { flags: 'a', mode: 0o777 }
});
const { combine, timestamp, label, printf } = winston.format;

module.exports = function (params) {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true, timestamp: true }),
    new winston.transports.File({ filename: "log/exceptions.log" })
  );
  process.on("uncaughtException", (error, source) => {
    //throw error;
    winston.error(error.message, error);
    throw (new Error('Error'));
    //process.exit(1);
  });
  const myFormat = printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`);
  const logger = winston.createLogger({
    format: combine(timestamp({
      format: () => {
        return moment().tz('Asia/Kolkata').format();
      }
    }), myFormat), handleExceptions: true, transports: [transport]
  });
  winston.add(logger);
};
