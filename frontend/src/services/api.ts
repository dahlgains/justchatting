import { io, Socket } from "socket.io-client";

const BACKEND_URL = "http://localhost:3000";

export const establishConnection = async (): Promise<Socket> => {
  try {
    const socket: Socket = io(BACKEND_URL);
    socket.on("connect", () => {
      console.log("Connected to the server");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Listen for messages from the server
    socket.on("message", (data: string) => {
      console.log("Message from server:", data);
    });

    // You can add more event listeners here as needed
    return socket; // Return the socket instance
  } catch (e) {
    console.error("Failure in establishing connection", e);
    throw e; // Rethrow the error for handling
  }
};

export const sendMessage = (socket: Socket, message: string): void => {
  socket.emit("sendMessage", message); // Send message to the server
};
