const { ShopCategories } = require("../models/ShopCategories");
const mongoose = require("mongoose");
const config = require("config");
const db = config.get('mongoDB');

const products = [
    new ShopCategories({
        name: 'Fruits and Vegetables',
        is_parent: true,
        image_path: '/images/category/1.png',
        is_active: true,
    }),
    new ShopCategories({
        name: 'Medicine',
        is_parent: true,
        image_path: '/images/category/2.png',
        is_active: true,
    }),
    new ShopCategories({
        name: 'Baby Care',
        is_parent: true,
        image_path: '/images/category/3.png',
        is_active: true,
    }),
    new ShopCategories({
        name: 'Stationary',
        is_parent: true,
        image_path: '/images/category/4.png',
        is_active: true,
    }),
    new ShopCategories({
        name: 'Beauty',
        is_parent: true,
        image_path: '/images/category/5.png',
        is_active: true,
    }),
    new ShopCategories({
        name: 'Gardening',
        is_parent: true,
        image_path: '/images/category/6.png',
        is_active: true,
    }),
]
//connect mongoose
mongoose
    .connect(db)
    .catch(err => {
        console.log(err.stack);
        process.exit(1);
    })
    .then(() => {
        console.log("connected to db in development environment");
    });
//save your data. this is an async operation
//after you make sure you seeded all the products, disconnect automatically
products.map(async (p, index) => {
    console.log(p, " o  ", index);
    await p.save();
});