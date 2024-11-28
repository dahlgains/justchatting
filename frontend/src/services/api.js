import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:3000";

export const establishConnection = async () => {
  try {
    const socket = io(BACKEND_URL);
    socket.on("connect", () => {
      console.log("Connected to the server");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Listen for messages from the server
    socket.on("message", (data) => {
      console.log("Message from server:", data);
    });

    // You can add more event listeners here as needed
  } catch (e) {
    console.error("Failure in establishing connection", e);
  }
};

export const sendMessage = (socket, message) => {
  socket.emit("sendMessage", message); // Send message to the server
};
