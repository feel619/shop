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
        let UserId = decodeData._id;
        let UserToken = bearerToken;
        let condition = { UserId: UserId };
        const userDetails = await ShopUsers.findById(UserId);
        if (userDetails) {
          req.userId = UserId;
          req.userToken = UserToken;
          req.userDetails = userDetails;
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
