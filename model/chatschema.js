const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    username: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
let Chat = mongoose.model("theChat", chatSchema);

module.exports = Chat;
