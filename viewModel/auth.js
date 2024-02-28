const Joi = require("joi");
const winston = require("winston");
//const { sql, poolPromise } = require("../startup/db");

const listGetByUsers = async (reqBody) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('FirstName', sql.VarChar(50), reqBody.firstName)
    .input('LastName', sql.VarChar(100), reqBody.lastName)
    .execute("uspGetUsersTest");
  winston.log("info", `Auth [uspGetUsersTest] Result ${JSON.stringify(result)} `);
  return result.output;
};

function validate(users) {
  winston.log("info", ` Customer Auth  ${JSON.stringify(users)}  `);
  const schema = Joi.object({
    firstName: Joi.string()
  });
  return schema.validate(users);
}

module.exports = {
  validate,
  listGetByUsers
};
