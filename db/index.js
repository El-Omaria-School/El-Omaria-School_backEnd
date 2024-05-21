const mongoose = require('mongoose')

const dbConnection = mongoose
  .connect(process.env.DB_URL)
  .then((data) => console.log('connected successfuly'))
  .catch((err) => console.log(err))

module.exports = dbConnection
