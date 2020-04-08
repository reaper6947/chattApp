const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var path = require("path");

// Specify a directory to serve static files
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

io.sockets.on("connection", function(socket) {
    socket.on("username", function(username) {
        socket.username = username;
        io.emit(
            "is_online",
            " <i>" + socket.username + " joined the chat..</i>"
        );
    });

    socket.on("disconnect", function(username) {
        io.emit(
            "is_online",
            " <i>" + socket.username + " left the chat..</i>"
        );
    });
    socket.on('typing', function(data){
        io.emit('typing', data);
     });

    socket.on("chat_message", function(message) {
        io.emit(
            "chat_message",
            "<b>" + socket.username + "</b>: " + message
        );
    });
});
const port = 3000 || process.env.PORT;
const server = http.listen(port, function() {
    console.log(`listening on *:${port}`);
});
