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
  let response = await ShopCart.findOne(msgObj).populate('items.product_id')
    .exec()
    .then(carts => {
      console.log("CartIems:", carts);
      return carts;
      // carts.items.forEach(cart => {
      //   console.log("Cart:", cart);
      //   // Access product details through the populated 'items.product_id' field
      //   cart.items.forEach(item => {
      //     console.log("Product details:", item.product_id);
      //   });
      // });
    })
    .catch(error => {
      console.error("Error finding carts:", error);
    });
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

function validateProductCart(users) {
  winston.log("info", ` ShopCart validateProductCart  ${JSON.stringify(users)}  `);
  const schema = Joi.object({
    product_id: Joi.string().required(),
    quantity: Joi.number().required(),
  });
  return schema.validate(users);
}

router.post("/insert", authentication, async (req, res) => {
  let reqBody = req?.body;
  const { error } = validateProductCart(reqBody);
  if (error) {
    winston.log("info", `insert ShopCart route insert ${JSON.stringify(error)}`);
    return res.status(400).send({ "status": true, "message": error.details[0].message });
  }
  // let IsDuplicateReq = { is_active: true, title: reqBody?.title };
  // let IsDuplicate = await ShopCart.findOne(IsDuplicateReq);
  // if (IsDuplicate) return res.status(409).send({ "status": false, "message": ' Product already Exist! ' })
  let response = null;
  let date = moment().format('YYYY-MM-DD');
  let time = moment().format('HH-mm');
  let { product_id, quantity } = reqBody;
  let cart = await ShopCart.findOne({
    user_id: new ObjectId(req?.user_id)
  });
  winston.log("info", `insert ShopCart route cart ${JSON.stringify(cart)}`);
  let productDetails = await ShopProduct.findById(product_id);
  winston.log("info", `insert ShopCart route productDetails ${JSON.stringify(productDetails)}`);
  if (productDetails) {
    if (cart) {
      let indexFound = cart.items.findIndex(p => p.product_id == product_id);
      if (indexFound != -1 && quantity == 0) {
        cart.items.splice(indexFound, 1);
        cart.subTotal = cart.items.map(item => item.total).reduce((acc, curr) => acc + curr);
      } else if (indexFound != -1) {
        //cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
        cart.items[indexFound].quantity = quantity;
        cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
        cart.items[indexFound].price = productDetails.price
        cart.subTotal = cart.items.map(item => item.total).reduce((acc, curr) => acc + curr);
      } else if (quantity > 0) {
        cart.items.push({
          product_id: product_id,
          quantity: quantity,
          price: productDetails.price,
          total: parseInt(productDetails.price * quantity).toFixed(2),
        })
        cart.subTotal = cart.items.map(item => item.total).reduce((acc, curr) => acc + curr);
      }
      response = await cart.save();
    } else {
      let insertReq = {
        order_id: moment().unix(),
        user_id: req?.user_id,
        items: [{
          product_id: productDetails._id,
          quantity: reqBody?.quantity,
          total: parseInt(productDetails.price * reqBody?.quantity),
          price: productDetails.price
        }],
        subTotal: parseInt(productDetails.price * quantity),
        //products: reqBody?.products,
        //total_price: reqBody?.total_price,
        //qty: reqBody?.qty,
        payment_status: false,
        date: date,
        time: time,
        is_active: true,
      };
      cart = new ShopCart(insertReq);
      response = await cart.save();
    }
  }
  if (response) {
    return res.status(200).send({ "status": true, "message": "inserted successfully!" });
  }
  return res.status(500).send({ "status": false, "message": 'Record Not found!' });
});


function validateCartAddress(users) {
  winston.log("info", ` ShopCart validateCartAddress  ${JSON.stringify(users)}  `);
  const schema = Joi.object({
    //order_id: Joi.string().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    locality: Joi.string().required(),
    pincode: Joi.number().required(),
    phone: Joi.number().required(),
    date: Joi.string().required(),
    time: Joi.string().required(),
  });
  return schema.validate(users);
}

//update request column
router.put("/updateCartAddress/:id", authentication, async (req, res) => {
  let reqBody = req?.body;
  const { error } = validateCartAddress(reqBody);
  if (error) {
    winston.log("info", `ShopCart updateCartAddress validate ${JSON.stringify(error)}`);
    return res.status(400).send({ "status": false, "message": error.details[0].message });
  }
  let id = req?.params?.id;
  let cart = await ShopCart.findById(id);
  if (cart) {
    let updateReq = {
      name: reqBody?.name,
      address: reqBody?.address,
      email: reqBody?.email,
      locality: reqBody?.locality,
      pincode: reqBody?.pincode,
      phone: reqBody?.phone,
      date: reqBody?.date,
      time: reqBody?.time,
    };
    console.log(updateReq, " s ");
    let query = { _id: id };
    let response = await ShopCart.updateOne(query, updateReq);
    if (response) {
      winston.log("info", `update ShopCart route updateCartAddress id${id} ${JSON.stringify(updateReq)}  res-${JSON.stringify(response)}`);
      return res.status(200).send({ "status": true, "message": "updated successfully!" });
    }
  }
  return res.status(500).send({ "status": false, "message": "No Record Found!" });
});


function validateCartPayment(users) {
  winston.log("info", ` ShopCart validateCartAddress  ${JSON.stringify(users)}  `);
  const schema = Joi.object({
    cardnumber: Joi.number().required(),
    cardname: Joi.string().required(),
    cardmonth: Joi.number().required(),
    cardyear: Joi.number().required(),
    cardcvv: Joi.number().required(),
  });
  return schema.validate(users);
}

//update request column
router.put("/updateCartPayment/:id", authentication, async (req, res) => {
  let reqBody = req?.body;
  const { error } = validateCartPayment(reqBody);
  if (error) {
    winston.log("info", `ShopCart updateCartPayment validate ${JSON.stringify(error)}`);
    return res.status(400).send({ "status": false, "message": error.details[0].message });
  }
  let id = req?.params?.id;
  let cart = await ShopCart.findById(id);
  if (cart) {
    let updateReq = {
      payment_status: true,
      is_active: false,
    };
    let query = { _id: id };
    let response = await ShopCart.updateOne(query, updateReq);
    if (response) {
      winston.log("info", `update ShopCart route updateCartPayment id${id} ${JSON.stringify(updateReq)}  res-${JSON.stringify(response)}`);
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