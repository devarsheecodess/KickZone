// LiveChat.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client"; // Import socket.io-client

// Connect to WebSocket server
const socket = io("https://kickzone-backend.onrender.com");

const LiveChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [emoji, setEmoji] = useState("😊");

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("chatMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up on component unmount
    return () => {
      socket.off("chatMessage");
    };
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const message = { text: inputValue, emoji };
      socket.emit("chatMessage", message); // Send message to the server
      setInputValue(""); // Clear the input field
    }
  };

  return (
    <div className="bottom-0 left-0 w-full z-10 p-4">
      <div className="flex flex-col w-full min-h-screen bg-red-800 rounded-lg shadow-lg overflow-hidden border-4 border-yellow-500">
        {/* Header with Home link */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-500">
          <h2 className="text-3xl font-bold text-white">Live Chat</h2>
          <Link to="/home" aria-label="Go to Home">
            <span className="text-xl text-white">🏠</span> {/* Home icon */}
          </Link>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          {/* Scrollable area for messages */}
          <div className="space-y-4 overflow-y-auto max-h-90">
            {messages.length === 0 ? (
              <p className="text-white">No messages yet.</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded shadow text-black">
                  <span>{msg.emoji}</span> {msg.text}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Input area for sending messages */}
        <div className="flex items-center p-4 bg-gray-800 border-t border-yellow-500">
          <button
            onClick={() => setEmoji(emoji === "😊" ? "😂" : "😊")}
            className="text-xl mr-2"
            aria-label="Select Emoji"
          >
            {emoji}
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded p-2 mr-2"
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
