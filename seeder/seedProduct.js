const { ShopProduct } = require("../models/ShopProduct");
const { ShopCategories } = require("../models/ShopCategories");
const mongoose = require("mongoose");
const config = require("config");
const db = config.get('mongoDB');

const products = [
    {
        imagePath: "images/fruitveg/1.jpg",
        title: 'Apple',
        product_description: 'apple',
        measurement: '1 kg',
        price: 100,
        price_description: '',
        is_new: true,
        is_popular: true,
        category: 'Fruits and Vegetables'
        //category: await ShopCategories.findOne('ShopCategories'),
    },
    {
        imagePath: "images/fruitveg/2.jpg",
        title: 'Chilli',
        product_description: 'Chilli',
        measurement: '1 kg',
        price: 80,
        price_description: '',
        is_new: true,
        is_popular: true,
        category: 'Fruits and Vegetables'
        //category: await ShopCategories.findOne('ShopCategories'),
    },
    {
        imagePath: "images/fruitveg/2.jpg",
        title: 'Onion',
        product_description: 'Onion',
        measurement: '1 kg',
        price: 50,
        price_description: '',
        is_new: true,
        is_popular: true,
        category: 'Fruits and Vegetables'
        //category: await ShopCategories.findOne('ShopCategories'),
    },
    {
        imagePath: "images/medicine/2.jpg",
        title: 'Cetirizine ',
        product_description: 'Cetirizine ',
        measurement: '10 tablets',
        price: 16.10,
        price_description: '',
        is_new: true,
        is_popular: true,
        category: 'Medicine'
        //category: await ShopCategories.findOne('ShopCategories'),
    },
    {
        imagePath: "images/medicine/2.jpg",
        title: 'CUFRIL-D Cough Syrup',
        product_description: 'CUFRIL-D Cough Syrup ',
        measurement: '10 tablets',
        price: 88.10,
        price_description: '',
        is_new: true,
        is_popular: true,
        category: 'Medicine'
        //category: await ShopCategories.findOne('ShopCategories'),
    },
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
function seedArticle(value) {
    ShopCategories.findOne({ name: value.category }).exec()
        .then(function (category) {
            value.category = category._id;
            console.log(value, " va ");
            return ShopProduct.create(value);
        });
}
products.map(async (p, index) => {
    seedArticle(p);
});