const express = require("express");
const router = express.Router();
const winston = require("winston");
const _ = require("lodash");
const Auth = require("../viewModel/auth");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/", async (req, res) => {

  const { error } = Auth.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //let { makeModel,serialNo, customer } = req.body;
  const results = await Auth.listGetByUsers(req.body);
  winston.log("info", `auth route middleware ${JSON.stringify(results)}`);
  //Auth.mailSent();
  _.set(results, "token", '');
  //_.set(results, "cutomer", customer);
  if (_.has(results, "Status") && results.Status === 'Active') {
    const token = jwt.sign({ _id: results.id }, config.get("jwtPrivateKey"));
    _.set(results, "token", token);
  }
  return res.status(200).send(results);

});

module.exports = router;
