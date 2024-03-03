const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const winston = require("winston");
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
const config = require("config");
let ObjectId = require('mongoose').Types.ObjectId;
const authentication = require('../middleware/authentication');
const { ShopProduct } = require('../models/ShopProduct');
const { ShopCategories } = require('../models/ShopCategories');
require('dotenv').config();

router.get("/byID", async (req, res) => {
  let msgObj = { '_id': req.query.ID, is_active: true };
  const response = await ShopProduct.findOne(msgObj);
  winston.log("info", `get ShopProduct viewModel byID ${JSON.stringify(response)}`);
  if (response) {
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

router.get("/getAll", async (req, res) => {
  let msgObj = { is_active: true };
  if (req?.query?.is_popular) {
    msgObj.is_popular = true;
  }
  if (req?.query?.category) {
    msgObj.category = new ObjectId(req?.query?.category);
  }
  if (req?.query?.search) {
    msgObj.title = { $regex: req?.query?.search, $options: 'i' };
  }
  console.log(msgObj, " mst ");
  const response = await ShopProduct.find(msgObj);
  if (response) {
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

router.get("/getAllby", async (req, res) => {
  let msgObj = { is_active: true };
  const response = await ShopProduct.find(msgObj);
  if (response) {
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

router.get("/:id", async (req, res) => {
  const response = await ShopProduct.findById(req.params.id);
  winston.log("info", `get ShopProduct viewModel byID ${JSON.stringify(response)}`);
  if (response) {
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

function validate(users) {
  winston.log("info", ` ShopProduct Validate  ${JSON.stringify(users)}  `);
  const schema = Joi.object({
    imagePath: Joi.string().required(),
    title: Joi.string().required(),
    product_description: Joi.string().required(),
    measurement: Joi.string().required(),
    price: Joi.number().required(),
    price_description: Joi.string().allow(null, ''),
    is_new: Joi.boolean().required(),
    is_popular: Joi.boolean().required(),
    is_active: Joi.boolean().required(),
    category: Joi.string().required(),
  });
  return schema.validate(users);
}

router.post("/insert", async (req, res) => {
  let reqBody = req?.body;
  const { error } = validate(reqBody);
  if (error) {
    winston.log("info", `insert ShopProduct route insert ${JSON.stringify(error)}`);
    return res.status(400).send({ "status": true, "message": error.details[0].message });
  }

  let IsDuplicateReq = { is_active: true, title: reqBody?.title };
  let IsDuplicate = await ShopProduct.findOne(IsDuplicateReq);
  if (IsDuplicate) return res.status(409).send({ "status": false, "message": ' Product already Exist! ' })

  let Category = await ShopCategories.findOne({ name: reqBody?.category });
  if (Category) {
    let insertReq = {
      imagePath: reqBody?.imagePath,
      title: reqBody?.title,
      product_description: reqBody?.product_description,
      measurement: reqBody?.measurement,
      price: reqBody?.price,
      price_description: reqBody?.price_description,
      is_new: reqBody?.is_new,
      is_popular: reqBody?.is_popular,
      is_active: reqBody?.is_active,
      category: Category._id
    };
    const response = await ShopProduct.create(insertReq);
    if (response) {
      return res.status(200).send({ "status": true, "message": "inserted successfully!" });
    }
  }
  return res.status(500).send({ "status": false, "message": 'Record Not found!' });
});

//update request column
router.put("/update/:id", async (req, res) => {
  let reqBody = req?.body;
  const { error } = validate(reqBody);
  if (error) {
    winston.log("info", `ShopProduct UpdateShopProduct validate ${JSON.stringify(error)}`);
    return res.status(400).send({ "status": false, "message": error.details[0].message });
  }
  let id = req?.params?.id;
  let IsDuplicateReq = { is_active: true, title: reqBody?.title, _id: { $ne: id } };
  let IsDuplicate = await ShopProduct.findOne(IsDuplicateReq);
  if (IsDuplicate) return res.status(409).send({ "status": false, "message": ' Product Already Exist! ' })

  let Category = await ShopCategories.findOne({ name: reqBody?.category });
  if (Category) {
    let updateReq = {
      imagePath: reqBody?.imagePath,
      title: reqBody?.title,
      product_description: reqBody?.product_description,
      measurement: reqBody?.measurement,
      price: reqBody?.price,
      price_description: reqBody?.price_description,
      is_new: reqBody?.is_new,
      is_popular: reqBody?.is_popular,
      is_active: reqBody?.is_active,
      category: Category._id
    };
    console.log(updateReq, " s ");
    let query = { _id: id };
    let response = await ShopProduct.findOneAndUpdate(query, updateReq, { upsert: true, setDefaultsOnInsert: true, timestamps: true, new: true });
    if (response) {
      winston.log("info", `update ShopProduct route Update id${id} ${JSON.stringify(updateReq)}  res-${JSON.stringify(response)}`);
      return res.status(200).send({ "status": true, "message": "updated successfully!" });
    }
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
  const response = await ShopProduct.updateOne(query, requestData);
  winston.log("info", `activeInactive ShopProduct route put ${JSON.stringify(response)}`);
  if (response) {
    return res.status(200).send({ "status": true, "message": "updated successfully!" });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

router.delete("/:id", async (req, res) => {
  const response = await ShopProduct.deleteOne({ _id: req?.params?.id });
  winston.log("info", `delete ShopProduct route delete ${JSON.stringify(response)}`);
  if (response) {
    return res.status(200).send({ "status": true, "message": "deleted successfully!" });
  }
  return res.status(401).send({ "status": false, "message": "No Record Found!" });
});


module.exports = router;