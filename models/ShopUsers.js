const mongoose = require('mongoose');
const winston = require("winston");

const ShopUsers = new mongoose.Schema({
    name: { type: String, default: null },
    email: { type: String, default: null },
    password: { type: String, default: null },
    phone: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ShopUsersModel = mongoose.model('ShopUsers', ShopUsers);
exports.ShopUsers = ShopUsersModel;