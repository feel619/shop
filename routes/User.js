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
//const { db } = require("../models");
//const Op = db.Sequelize.Op;
//const EmployeeMst = require('../viewModel/EmployeeMst');
//const { } = require("../controllers/AstAllocation");
const { ShopUsers } = require('../models/ShopUsers');
require('dotenv').config();
const { body, checkSchema, validationResult } = require('express-validator');

const registrationSchema = {
  name: {
    custom: {
      options: async value => {
        return ShopUsers.find({
          Name: value
        }).then(user => {
          if (user.length > 0) {
            return Promise.reject('Username already in use')
          }
        })
      }
    }
  },
  password: {
    isStrongPassword: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1
    },
    errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number",
  },
  phone: {
    notEmpty: true,
    errorMessage: "Phone number cannot be empty"
  },
  email: {
    normalizeEmail: true,
    custom: {
      options: async value => {
        return ShopUsers.find({
          email: value
        }).then(user => {
          if (user.length > 0) {
            return Promise.reject('Email address already taken')
          }
        })
      }
    }
  }
}


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
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const alert = errors.array()
  //   res.redirect('login', {
  //     alert
  //   })
  // }
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