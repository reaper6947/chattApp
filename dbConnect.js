const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const dotenv = require("dotenv").config();
const dbUrl = process.env.DBURL;

const dbconnect = mongoose.connect(
  dbUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("mongodb connected", err);
  }
);
    

module.exports = dbconnect;