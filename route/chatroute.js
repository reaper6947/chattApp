const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const Chats = require("../model/chatschema");
const connectdb = require("./../dbConnect");

const router = express.Router();



module.exports = router;