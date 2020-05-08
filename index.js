const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var path = require("path");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const name = require("./username");
//this is for auto https upgrades for production
/*
function checkHttps(req, res, next){
  // protocol check, if http, redirect to https
  
  if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
    console.log("https, yo")
    return next()
  } else {
    console.log("just http")
    res.redirect('https://' + req.hostname + req.url);
  }
}
app.all('*', checkHttps)
*/

// Specify a directory to serve static files
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public"));
});

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
let dbUrl =
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
    username: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
let Chat = mongoose.model("theChat", chatSchema);
var usersArr = [];
io.sockets.on("connection", function (socket) {
  socket.on("username", function (username) {
    //validating username
    socket.username = name.validUser(username);
    usersArr.push(socket.username);
  //  console.log(usersArr);
    io.emit("is_online", " <i>" + socket.username + " joined the chat..</i>");
    io.emit("users",usersArr );
  });

  socket.on("disconnect", function (username) {
    usersArr.splice(usersArr.indexOf(socket.username), 1);
  //  console.log(usersArr);
   // console.log(Object.keys(io.sockets.sockets));
    io.emit("is_online", " <i>" + socket.username + " left the chat..</i>");
    io.emit("users",usersArr );
  });
  //sends info about typing
  socket.on("typing", function (data) {
    // console.log(data.length, data);
    socket.broadcast.emit("typing", data);
  });
/*
  socket.on("users", function () {
    io.emit("users",usersArr );
  });
*/
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
     // let data = Chat.find({});
      Chat.find({}).then((chat) => {
        res.json(chat);
      });
    });
  });

});
const port = 3000 || process.env.PORT;
const server = http.listen(port, function () {
  console.log(`listening on *:${port}`);
});
