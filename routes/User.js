const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const winston = require("winston");
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
const config = require("config");
const jwt = require("jsonwebtoken");
const { ShopUsers } = require('../models/ShopUsers');
require('dotenv').config();

function RegisterValidate(users) {
  winston.log("info", ` Customer RegisterValidate  ${JSON.stringify(users)}  `);
  const schema = Joi.object({
    email: Joi.string().email(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.number().required(),
  });
  return schema.validate(users);
}

//update Org Location list on mongodb
router.post("/register", async (req, res) => {
  let reqBody = req?.body;
  const { error } = RegisterValidate(reqBody);
  if (error) {
    winston.log("error", `user route register ${JSON.stringify(error)}`);
    return res.status(400).send({ "status": true, "message": error.details[0].message });
  }
  const isExist = await ShopUsers.findOne({ email: reqBody?.email });
  if (isExist) {
    return res.status(409).send({ "status": true, "message": 'Email address already taken' });
  }
  let insertReq = { name: reqBody?.name, email: reqBody?.email, password: reqBody?.password, phone: reqBody?.phone };
  const results = await ShopUsers.create(insertReq);
  winston.log("info", `post register route ${JSON.stringify(results)}`);
  if (results) {
    const token = jwt.sign({ _id: results._id }, config.get("jwtPrivateKey"));
    let response = {
      ...results._doc,
      token
    };
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

function loginValidate(users) {
  winston.log("info", ` Customer Auth  ${JSON.stringify(users)}  `);
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().required(),
  });
  return schema.validate(users);
}

//login api
router.post("/login", async (req, res) => {
  let reqBody = req?.body;
  const { error } = loginValidate(reqBody);
  if (error) {
    winston.log("info", `user route register ${JSON.stringify(error)}`);
    return res.status(400).send({ "status": true, "message": error.details[0].message });
  }
  const results = await ShopUsers.findOne({ Email: reqBody?.email, Password: reqBody.password });
  if (results) {
    //generate token jwt
    const token = jwt.sign({ _id: results._id }, config.get("jwtPrivateKey"));
    let response = {
      ...results._doc,
      token
    };
    console.log(results, " resul ");
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "Email Or Password Wrong!" });
});

module.exports = router;