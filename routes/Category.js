const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const winston = require("winston");
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
const config = require("config");
const authentication = require('../middleware/authentication');
const { ShopCategories } = require('../models/ShopCategories');
require('dotenv').config();

router.get("/byID", async (req, res) => {
  let msgObj = { '_id': req.query.ID, is_active: true };
  const response = await ShopCategories.findOne(msgObj);
  winston.log("info", `get ShopCategories viewModel byID ${JSON.stringify(response)}`);
  if (response) {
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

router.get("/getAll", async (req, res) => {
  let msgObj = { is_active: true };
  const response = await ShopCategories.find(msgObj);
  if (response) {
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

router.get("/:id", async (req, res) => {
  const response = await ShopCategories.findById(req.params.id);
  winston.log("info", `get ShopCategories viewModel byID ${JSON.stringify(response)}`);
  if (response) {
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

function validate(users) {
  winston.log("info", ` Customer Auth  ${JSON.stringify(users)}  `);
  const schema = Joi.object({
    name: Joi.string().required(),
    image_path: Joi.string().required(),
    is_parent: Joi.boolean().required(),
    is_active: Joi.boolean().required(),
  });
  return schema.validate(users);
}

router.post("/insert", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    winston.log("info", `insert ShopCategories route insert ${JSON.stringify(error)}`);
    return res.status(400).send({ "status": true, "message": error.details[0].message });
  }
  let IsDuplicateReq = { is_active: true, name: req?.body?.name };
  let IsDuplicate = await ShopCategories.findOne(IsDuplicateReq);
  if (IsDuplicate) return res.status(409).send({ "status": false, "message": ' Category already Exist! ' })
  let insertReq = {
    name: req?.body?.name,
    is_parent: req?.body?.is_parent,
    image_path: req?.body?.image_path,
    is_active: req?.body?.is_active,
  };
  const response = await ShopCategories.create(insertReq);
  if (response) {
    return res.status(200).send({ "status": true, "message": "inserted successfully!" });
  }
  return res.status(500).send({ "status": false, "message": 'Record Not found!' });
});

//update request column
router.put("/update/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    winston.log("info", `ShopCategories UpdateShopCategories validate ${JSON.stringify(error)}`);
    return res.status(400).send({ "status": false, "message": error.details[0].message });
  }
  let id = req?.params?.id;
  let IsDuplicateReq = { is_active: true, name: req?.body?.name, _id: { $ne: id } };
  let IsDuplicate = await ShopCategories.findOne(IsDuplicateReq);
  if (IsDuplicate) return res.status(409).send({ "status": false, "message": ' Category Already Exist! ' })

  let updateReq = {
    name: req?.body?.name,
    is_parent: req?.body?.is_parent,
    image_path: req?.body?.image_path,
    is_active: req?.body?.is_active,
  };
  let query = { _id: id };
  let response = await ShopCategories.findOneAndUpdate(query, updateReq, { upsert: true, setDefaultsOnInsert: true, timestamps: true, new: true });
  if (response) {
    winston.log("info", `update ShopCategories route Update id${id} ${JSON.stringify(updateReq)}  res-${JSON.stringify(response)}`);
    return res.status(200).send({ "status": true, "message": "updated successfully!" });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

//inactive 
router.put("/activeInactive/:id", async (req, res) => {
  let id = req?.params?.id;
  let is_active = req?.body?.is_active;
  let requestData = {
    is_active: is_active,
  };
  let query = { _id: id };
  const response = await ShopCategories.updateOne(query, requestData);
  winston.log("info", `activeInactive ShopCategories route put ${JSON.stringify(response)}`);
  if (response) {
    return res.status(200).send({ "status": true, "message": "updated successfully!" });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

router.delete("/:id", async (req, res) => {
  const response = await ShopCategories.deleteOne({ _id: req.params.id });
  winston.log("info", `delete ShopCategories route delete ${JSON.stringify(response)}`);
  if (response) {
    return res.status(200).send({ "status": true, "message": "deleted successfully!" });
  }
  return res.status(401).send({ "status": false, "message": "No Record Found!" });
});


module.exports = router;