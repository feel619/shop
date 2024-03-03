const jwt = require("jsonwebtoken");
const config = require("config");
const winston = require("winston");
const { ShopUsers } = require('../models/ShopUsers');

module.exports = async function (req, res, next) {
  const token = req.headers["authorization"];
  if (typeof token !== "undefined") {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];
    try {
      if (bearerToken) {
        const decodeData = jwt.verify(bearerToken, config.get("jwtPrivateKey"));
        let user_id = decodeData._id;
        let user_token = bearerToken;
        let condition = { user_id: user_id };
        const userDetails = await ShopUsers.findById(user_id);
        if (userDetails) {
          req.user_id = user_id;
          req.user_token = user_token;
          req.user_details = userDetails;
          next();
          return true;
        }
        return res.status(401).send("invalide user Id !");
      } else {
        return res.status(401).send("token required!");
      }
    } catch (error) {
      return res.status(401).send("invalid token!");
    }
  } else {
    return res.status(401).send("token required!");
  }
};
