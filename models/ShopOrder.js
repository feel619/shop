const mongoose = require('mongoose');
const winston = require("winston");

const ShopCart = new mongoose.Schema({
    cart_id: { type: mongoose.Schema.ObjectId, ref: "ShopUsers" },
    user_id: { type: mongoose.Schema.ObjectId, ref: "ShopUsers" },
    payment_status: { type: Boolean, default: false },
    date: { type: String, required: true, trim: true, default: null },
    time: { type: String, required: true, trim: true, default: null },
    is_active: { type: Boolean, required: true, default: true },
    address: { type: String, required: true, trim: true, default: null },
    locality: { type: String, required: true, trim: true, default: null },
    address: { type: String, required: true, trim: true, default: null },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// ShopCart.pre('find', function (next) {
//     if (this.options._recursed) {
//         return next();
//     }
//     this.populate({ path: 'items', options: { _recursed: true } });
//     next();
// });

const ShopCartModel = mongoose.model('ShopCart', ShopCart);
exports.ShopCart = ShopCartModel;