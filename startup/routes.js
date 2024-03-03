const express = require("express");
//const app = express();
const cors = require("cors");
const error = require("../middleware/error");
const auth = require("../routes/auth");
const User = require("../routes/User");
const Category = require("../routes/Category");
const Product = require("../routes/Product");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.set("view engine", "ejs");
  //app.set("socketio", app.io);
  app.use(function (req, res, next) {
    //req.io = app.io;
    next();
  });
  app.use("/api/auth", auth);
  app.use("/api/v1/User", User);
  app.use("/api/v1/Category", Category);
  app.use("/api/v1/Product", Product);

  app.get('/', function (req, res) {
    res.render("login");
    // res.sendFile(path.join(__dirname, '/view/index.html'));
  });

  // Default route
  app.get("*", (req, res) => {
    res.send("404 PAGE NOT FOUND");
  });
  app.use(error);
};
