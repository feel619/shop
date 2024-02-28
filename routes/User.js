const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const winston = require("winston");
const User = require('../controllers/User');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
const config = require("config");
const jwt = require("jsonwebtoken");
const { ShopUsers } = require('../models/ShopUsers');
require('dotenv').config();

function validateRegister(users) {
  winston.log("info", ` Customer validateRegister  ${JSON.stringify(users)}  `);
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.number().required(),
    password: Joi.string().required(),
  });
  return schema.validate(users);
}

//update Org Location list on mongodb
router.post("/register", async (req, res) => {
  let reqBody = req?.body;
  const { error } = validateRegister(reqBody);
  if (error) {
    winston.log("error", `user route register ${JSON.stringify(error)}`);
    return res.status(400).send({ "status": true, "message": error.details[0].message });
  }
  const isExist = await ShopUsers.findOne({ Email: reqBody?.email });
  if (isExist) {
    //return Promise.reject('Email address already taken')
    return res.status(409).send({ "status": true, "message": 'Email address already taken' });
  }
  let insertReq = { Name: reqBody?.name, Email: reqBody?.email, Password: reqBody?.password, Phone: reqBody?.phone };
  const response = await ShopUsers.create(insertReq);
  winston.log("info", `post register route ${JSON.stringify(response)}`);
  if (response) {
    //res.render("login");
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