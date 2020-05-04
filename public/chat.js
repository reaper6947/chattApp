var socket = io.connect("localhost:3000");
var formEl = document.getElementById("chatForm");
var textInputEl = document.getElementById("txt");
var messagesEl = document.getElementById("messages-ul");
var typingEl = document.getElementById("main-head-i");
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  var sendMsg = textInputEl.value.trim();
  if (sendMsg != 0) {
    socket.emit("chat_message", textInputEl.value);
    socket.emit("typing", "");
    textInputEl.value = "";
    return false;
  }
});

// append the chat text message
socket.on("chat_message", function (msg) {
  let child = document.createElement("li");
  child.classList.add(
    "list-group-item",
    "list-group-item-dark",
    "overflow-auto",
    "d-flex",
    "border-0",
    "message-cl"
  );
  child.innerHTML = msg;
  messagesEl.appendChild(child);
});
// sends info about typing to server
textInputEl.addEventListener("input", function () {
  let validate = textInputEl.value.trim();
  console.log(validate);
  if (validate != "") {
    console.log(validate.length);
    socket.emit("typing", username);
  } else {
    socket.emit("typing", "");
  }
});
//receive info about user typing
socket.on("typing", function (data) {
  if (data.length != 0 && data != username) {
    typingEl.innerText = `${data} is typing`;
  } else if (data.length <= 0) {
    typingEl.innerText = "";
  }
});

// append text if someone is online
socket.on("is_online", function (username) {
  let child = document.createElement("li");
  child.classList.add("mx-auto", "joined-cl");
  let italic = document.createElement("i");
  italic.innerText = `${username} has joined the chat`;
  child.appendChild(italic);
  messagesEl.appendChild(child);
  textInputEl.setAttribute("placeholder", `type as ${username}`);
});

// ask username
var userPrompt = prompt("Please tell me your name");
let username = userPrompt.trim();
socket.emit("username", username);
