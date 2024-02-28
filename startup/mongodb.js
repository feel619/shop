const winston = require("winston");
const mongoose = require('mongoose');
const config = require("config");
//const { MongoClient } = require("mongodb");
const db = config.get('mongoDB');
const _ = require("lodash");

module.exports = async function () {
  mongoose.connect(db)
    .then(() => {
      winston.info(`Connected to mongoDB ${db}...`)

    }).catch(err => {
      winston.log("error", `Error to mongoDB connection query fields  ${err}  `);
    })
}