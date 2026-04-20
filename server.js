const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  players[socket.id] = {
    x: 100,
    y: 100,
    name: "Player"
  };

  socket.on("setName", (name) => {
    if (players[socket.id]) {
      players[socket.id].name = name;
    }
  });

  socket.on("move", (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
    }
  });

  socket.on("sendChat", (msg) => {
    if (players[socket.id]) {
      io.emit("chat", {
        name: players[socket.id].name,
        msg: msg
      });
    }
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  });
});

setInterval(() => {
  io.emit("players", players);
}, 100);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
