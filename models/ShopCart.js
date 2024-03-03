const mongoose = require('mongoose');
const winston = require("winston");

const ShopCart = new mongoose.Schema({
    order_id: { type: String, required: true, trim: true, default: null },
    user_id: { type: mongoose.Schema.ObjectId, ref: "ShopUsers" },
    products: [{ type: mongoose.Schema.ObjectId, ref: "ShopProduct" }],
    total_price: { type: Number, required: true, trim: true, default: 0 },
    payment_status: { type: Boolean, default: false },
    date: { type: String, required: true, trim: true, default: null },
    time: { type: String, required: true, trim: true, default: null },
    is_active: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ShopCartModel = mongoose.model('ShopCart', ShopCart);
exports.ShopCart = ShopCartModel;