const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var path = require("path");

const name = require("./username");
// Specify a directory to serve static files
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
let dbUrl ="mongodb+srv://admin:uHENT4tDAZnliV0T@chatapp-mlab-tvvyd.gcp.mongodb.net/test";
const connect = mongoose.connect(
  dbUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("mongodb connected", err);
  }
);
const Schema = mongoose.Schema;
const chatSchema = new Schema(
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
//sends the previous messages to client


io.sockets.on("connection", function (socket) {
  socket.on("username", function (username) {
    //validating username
    socket.username = name.validUser(username);
    io.emit("is_online", " <i>" + socket.username + " joined the chat..</i>");
  });

  socket.on("disconnect", function (username) {
    io.emit("is_online", " <i>" + socket.username + " left the chat..</i>");
  });

  socket.on("typing", function (data) {
    console.log(data.length, data);
    io.emit("typing", data);
  });

  socket.on("chat_message", function (message) {
    io.emit("chat_message", "" + socket.username + ": " + message);
  });
  app.get("/chat",(req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    connect.then(db => {
        let data = Chat.find({});
      Chat.find({}).then(chat => {
        res.json(chat);
      });
    });
  });
});
const port = 3000 || process.env.PORT;
const server = http.listen(port, function () {
  console.log(`listening on *:${port}`);
});
