const mongoose = require("mongoose");

const dbConnection = mongoose
  .connect(process.env.MONGO_URI)
  .then((data) => console.log("connected successfuly"))
  .catch((err) => console.log(err));

module.exports = dbConnection;
