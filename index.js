const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var path = require("path");
//const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const name = require("./username");
//connecting the mongo database 
const connect = require("./dbConnect");
//const connect = dbConnect(process.env.DBURL);
//new schema instance
const Chat = require("./model/chatschema");

//this is for auto https upgrades for production

const checkHttps = require("./route/httpsUpgrade")
//app.all('*', checkHttps)


// Specify a directory to serve static files
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public"));
});

var usersArr = [];
io.sockets.on("connection", function (socket) {
  socket.on("username", function (username) {
    //validating username
    socket.username = name.validUser(username);
    usersArr.push(socket.username);
    //  console.log(usersArr);
    io.emit("is_online", " <i>" + socket.username + " joined the chat..</i>");
    io.emit("users", usersArr);
    //  console.log(socket.id + " joined");
  });

  socket.on("disconnect", function (username) {
    usersArr.splice(usersArr.indexOf(socket.username), 1);

    // console.log(Object.keys(io.sockets.sockets));
    io.emit("is_online", " <i>" + socket.username + " left the chat..</i>");
    io.emit("users", usersArr);
    // console.log(socket.id + " left");
  });
  //sends info about typing
  socket.on("typing", function (data) {
    // console.log(data.length, data);
    socket.broadcast.emit("typing", data);
  });

  //sends the previous messages to client
  socket.on("chat_message", function (message) {
    io.emit("chat_message", "" + socket.username + ": " + message);
    connect.then((db) => {
      //  console.log(`${socket.username}:${message}`);
      let chatMessage = new Chat({
        message: message,
        username: socket.username,
      });
      chatMessage.save();
    });
  });


  app.get("/chat", (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    connect.then((db) => {
      Chat.find({}).then((chat) => {
        res.json(chat);
      });
    });
  });

  app.get("/set/user", function (req, res) {
    res.status(200).sendFile(path.join(__dirname, "public", "user.html"));
  });
});
const port = 3000 || process.env.PORT;
const server = http.listen(port, function () {
  console.log(`listening on *:${port}`);
});
