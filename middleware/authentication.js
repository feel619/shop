const jwt = require("jsonwebtoken");
const config = require("config");
const winston = require("winston");
const { ShopUsers } = require('../models/ShopUsers');

module.exports = async function (req, res, next) {
  //check token
  const token = req.headers["authorization"];
  //if (!token) return res.status(401).send("token required!");
  if (typeof token !== "undefined") {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];
    try {
      let userInfo = bearerToken.split(":");
      if (userInfo[0] && userInfo[1]) {
        let UserIDStr = userInfo[0];
        let UserID = parseInt(UserIDStr);
        let UserToken = userInfo[1];
        req.userId = UserID;
        req.userToken = UserToken;
        const UserResponse = await ShopUsers.findOne({ UserID: UserID });
        winston.log("info", `authentication middleware UserResponse mongodb login ${JSON.stringify(UserResponse)} `);
        if (UserResponse) {
          req.userDetails = UserResponse;
          next();
          return true;
        }
        return res.status(400).send("invalide user Id !");
      } else {
        return res.status(400).send("token required!");
      }
    } catch (error) {
      return res.status(400).send("invalid token!");
    }
  } else {
    return res.status(401).send("token required!");
  }
};
