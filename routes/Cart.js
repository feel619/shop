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
const { ShopCart } = require('../models/ShopCart');
require('dotenv').config();

router.get("/byID", authentication, async (req, res) => {
  let msgObj = { '_id': req.query.ID, is_active: true };
  const response = await ShopCart.findOne(msgObj);
  winston.log("info", `get ShopCart viewModel byID ${JSON.stringify(response)}`);
  if (response) {
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

router.get("/getAll", authentication, async (req, res) => {
  let msgObj = { is_active: true };
  const response = await ShopCart.find(msgObj);
  if (response) {
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

router.get("/getAll", authentication, async (req, res) => {
  let msgObj = { is_active: true };
  const response = await ShopCart.find(msgObj);
  if (response) {
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

router.get("/:id", authentication, async (req, res) => {
  const response = await ShopCart.findById(req.params.id);
  winston.log("info", `get ShopCart viewModel byID ${JSON.stringify(response)}`);
  if (response) {
    return res.status(200).send({ "status": true, "message": response });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

function validate(users) {
  winston.log("info", ` ShopCart Validate  ${JSON.stringify(users)}  `);
  const schema = Joi.object({
    //products: [{ type: mongoose.Schema.ObjectId, ref: "ShopProduct" }],
    total_price: Joi.number().required(),
    payment_status: Joi.boolean().required(),
    date: Joi.string().required(),
    time: Joi.string().required(),
    is_active: Joi.boolean().required(),
  });
  return schema.validate(users);
}

router.post("/insert", authentication, async (req, res) => {
  let reqBody = req?.body;
  const { error } = validate(reqBody);
  if (error) {
    winston.log("info", `insert ShopCart route insert ${JSON.stringify(error)}`);
    return res.status(400).send({ "status": true, "message": error.details[0].message });
  }

  let IsDuplicateReq = { is_active: true, title: reqBody?.title };
  let IsDuplicate = await ShopCart.findOne(IsDuplicateReq);
  if (IsDuplicate) return res.status(409).send({ "status": false, "message": ' Product already Exist! ' })

  let Category = await ShopCategories.findOne({ name: reqBody?.category });
  //reqBody?.products add product
  let date = moment().format('YYYY-MM-DD');
  let time = moment().format('HH-mm');
  if (Category) {
    let insertReq = {
      order_id: moment().unix(),
      user_id: req?._id,
      products: reqBody?.products,
      total_price: reqBody?.total_price,
      qty: reqBody?.qty,
      payment_status: false,
      date: date,
      time: time,
      is_active: true,
    };
    const response = await ShopCart.create(insertReq);
    if (response) {
      return res.status(200).send({ "status": true, "message": "inserted successfully!" });
    }
  }
  return res.status(500).send({ "status": false, "message": 'Record Not found!' });
});

//update request column
router.put("/update/:id", authentication, async (req, res) => {
  let reqBody = req?.body;
  const { error } = validate(reqBody);
  if (error) {
    winston.log("info", `ShopCart UpdateShopCart validate ${JSON.stringify(error)}`);
    return res.status(400).send({ "status": false, "message": error.details[0].message });
  }
  let id = req?.params?.id;
  let IsDuplicateReq = { is_active: true, title: reqBody?.title, _id: { $ne: id } };
  let IsDuplicate = await ShopCart.findOne(IsDuplicateReq);
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
    let response = await ShopCart.findOneAndUpdate(query, updateReq, { upsert: true, setDefaultsOnInsert: true, timestamps: true, new: true });
    if (response) {
      winston.log("info", `update ShopCart route Update id${id} ${JSON.stringify(updateReq)}  res-${JSON.stringify(response)}`);
      return res.status(200).send({ "status": true, "message": "updated successfully!" });
    }
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

//inactive 
router.put("/activeInactive/:id", authentication, async (req, res) => {
  let id = req?.params?.id;
  let is_active = req?.body?.is_active;
  let requestData = {
    is_active: is_active,
  };
  let query = { _id: id };
  const response = await ShopCart.updateOne(query, requestData);
  winston.log("info", `activeInactive ShopCart route put ${JSON.stringify(response)}`);
  if (response) {
    return res.status(200).send({ "status": true, "message": "updated successfully!" });
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});

router.delete("/:id", authentication, async (req, res) => {
  const response = await ShopCart.deleteOne({ _id: req?.params?.id });
  winston.log("info", `delete ShopCart route delete ${JSON.stringify(response)}`);
  if (response) {
    return res.status(200).send({ "status": true, "message": "deleted successfully!" });
  }
  return res.status(401).send({ "status": false, "message": "No Record Found!" });
});


module.exports = router;