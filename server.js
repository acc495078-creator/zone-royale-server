const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  players[socket.id] = { x: 100, y: 100, name: "Player" };

  socket.on("setName", (name) => {
    players[socket.id].name = name;
  });

  socket.on("move", (data) => {
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;
  });

  socket.on("chat", (msg) => {
    io.emit("chat", msg);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  });
});

// Send players data continuously
setInterval(() => {
  io.emit("players", players);
}, 100);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
