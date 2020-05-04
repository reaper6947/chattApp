const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var path = require("path");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
var dbUrl =
  "mongodb+srv://admin:uHENT4tDAZnliV0T@chatapp-mlab-tvvyd.gcp.mongodb.net/test";
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
    sender: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

let Chat = mongoose.model("theChat", chatSchema);



// Specify a directory to serve static files
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

io.sockets.on("connection", function (socket) {
  socket.on("username", function (username) {
    if (
      username === "" ||
      username === null ||
      username === undefined ||
      username === "undefined"
    ) {
      let mat = Math.floor(Math.random() * 10) + 1;
      let str = Math.random().toString(36).substr(2, 3);
      var userId = `user-${mat}${str}`;
      socket.username = userId;
    } else {
      socket.username = username;
    }

    io.emit("is_online", socket.username);
  });

  socket.on("disconnect", function (username) {
    io.emit("is_online", " <i>" + socket.username + " left the chat..</i>");
  });
  socket.on("typing", function (data) {
    io.emit("typing", data);
  });

  socket.on("chat_message", function (message) {
    io.emit("chat_message", "<b>" + socket.username + "</b>: " + message);
    
    connect.then((db) => {
      console.log(`${socket.username}:${message}`);
      let chatMessage = new Chat({ message: message, sender: socket.username });

      chatMessage.save();
    });
    
  });
});

const port = 3000 || process.env.PORT;
const server = http.listen(port, function () {
  console.log(`listening on *:${port}`);
});
