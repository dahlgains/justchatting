const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from the frontend
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Emit a welcome message to the newly connected user
  socket.emit("message", "Welcome to the chat!");

  // Handle incoming messages from the client
  socket.on("sendMessage", (msg) => {
    console.log("Message received:", msg);

    // Broadcast the message to all connected clients
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
