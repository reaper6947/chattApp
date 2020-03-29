var socket = io.connect("http://localhost:3000");
var formEl = document.getElementById("chatForm");
var textInputEl = document.getElementById("txt");
var messagesEl = document.getElementById("messages");

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("chat_message", textInputEl.value);
  textInputEl.value = "";
  return false;
});

// append the chat text message
socket.on("chat_message", function(msg) {
  let child = document.createElement("li");
  child.classList.add(
    "list-group-item",
    "list-group-item-dark",
    "overflow-auto"
  );
  child.innerHTML = msg;
  messagesEl.appendChild(child);
});

// append text if someone is online
socket.on("is_online", function(username) {
  let child = document.createElement("li");
  child.classList.add("mx-auto", "joined-cl");
  child.innerHTML = username;
  messagesEl.appendChild(child);
});

// ask username

var username = prompt("Please tell me your name");

if (username == "" || username == null || username == undefined || username == "undefined") {
    let mat = Math.floor(Math.random() * 10) + 1;
    let str = Math.random().toString(36).substr(2, 3)
  var username = `user-${mat}${str}`;
} 
socket.emit("username", username);