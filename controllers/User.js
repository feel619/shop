const winston = require("winston");
const _ = require("lodash");
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
const config = require("config");
const { ShopUsers } = require('../models/ShopUsers');
require('dotenv').config();

//update user Details on mongodb
const upsertRegister = async (req) => {
    winston.log("info", `User controllers upsertRegister req ${JSON.stringify(req.body)} `);
    try {
        let reqBody = req?.body;
        let empInfo = await ShopUsers.findOne({ Email: reqBody.email });
        if (empInfo) {
            // winston.log("info", `User controllers upsertRegister empInfo ${empInfo}`);
        }
        return empInfo;
    } catch (error) {
        winston.log("info", `User controllers upsertRegister error-${error}`);
    }
};

module.exports = {
    upsertRegister,
};