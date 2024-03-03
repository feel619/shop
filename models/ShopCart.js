const mongoose = require('mongoose');
const winston = require("winston");

const ShopCart = new mongoose.Schema({
    order_id: { type: String, required: true, trim: true, default: null },
    user_id: { type: mongoose.Schema.ObjectId, ref: "ShopUsers" },
    //products: { type: mongoose.Schema.ObjectId, ref: "ShopProduct" },
    items: [{
        product_id: { type: mongoose.Schema.ObjectId, ref: "ShopProduct" },
        quantity: { type: Number, required: true, trim: true, default: 0 },
        total: { type: Number, required: true, trim: true, default: 0 },
        price: { type: Number, required: true, trim: true, default: 0 },
    }],
    subTotal: { type: Number, required: true, trim: true, default: 0 },
    payment_status: { type: Boolean, default: false },
    name: { type: String, required: true, trim: true, default: null },
    address: { type: String, required: true, trim: true, default: null },
    email: { type: String, required: true, trim: true, default: null },
    locality: { type: String, required: true, trim: true, default: null },
    pincode: { type: String, required: true, trim: true, default: null },
    phone: { type: String, required: true, trim: true, default: null },
    date: { type: String, required: true, trim: true, default: null },
    time: { type: String, required: true, trim: true, default: null },
    is_active: { type: Boolean, required: true, default: true },
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