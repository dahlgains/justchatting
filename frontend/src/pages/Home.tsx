import { useEffect, useState } from "react";
import { sendMessage } from "../services/api.js";
import { io } from "socket.io-client";

const Home = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");

    // Listen for messages from the server
    socketInstance.on("message", (data: string) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    setSocket(socketInstance);

    // Cleanup socket connection on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && input) {
      sendMessage(socket, input); // Emit the message
      setInput("");
    }
  };

  return (
    <>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form id="form" onSubmit={handleSend}>
        <input
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
};

export default Home;
