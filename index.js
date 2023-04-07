const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);

const gamedirectory = path.join(__dirname, "html");

app.use(express.static(gamedirectory));

httpserver.listen(3000);

const rooms = {};
const usernames = {};

io.on('connection', function(socket){

  socket.on("join", function(room, username){
    if (username !== ""){
      rooms[socket.id] = room;
      usernames[socket.id] = username;
      socket.leaveAll();
      socket.join(room);
      io.in(room).emit("receive", "Server: " + username + " has joined the chat.");
      socket.emit("join", room);
    }
  })

  socket.on("send", function(message){
    io.in(rooms[socket.id]).emit("receive", usernames[socket.id] + " : " + message);
  })

  socket.on("receive", function(message){
    socket.emit("receive", message);
  })
})
