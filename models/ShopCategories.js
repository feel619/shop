const mongoose = require('mongoose');
const winston = require("winston");
const ShopCategories = new mongoose.Schema({
    name: { type: String, default: null },
    is_parent: { type: Boolean, default: null },
    image_path: { type: String, default: null },
    is_active: { type: Boolean, default: null },
    products: [{ type: mongoose.Schema.ObjectId, ref: "ShopProduct" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const ShopCategoriesModel = mongoose.model('ShopCategories', ShopCategories);
exports.ShopCategories = ShopCategoriesModel;