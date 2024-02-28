const mongoose = require('mongoose');
const winston = require("winston");

const ShopProduct = new mongoose.Schema({
    imagePath: { type: String, required: true, trim: true, default: null },
    title: { type: String, required: true, trim: true, default: null },
    product_description: { type: String, required: true, trim: true, default: null },
    measurement: { type: String, required: true, trim: true, default: null },
    price: { type: Number, required: true, default: null },
    price_description: { type: String, trim: true, default: null },
    is_new: { type: Boolean, trim: true, default: null },
    is_popular: { type: Boolean, trim: true, default: null },
    category: { type: mongoose.Schema.ObjectId, ref: "ShopCategory" },
    is_active: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ShopProductModel = mongoose.model('ShopProduct', ShopProduct);
exports.ShopProduct = ShopProductModel;