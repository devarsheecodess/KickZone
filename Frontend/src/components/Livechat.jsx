import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const LiveChat = () => {
  const [messages, setMessages] = useState([]); // State to hold chat messages
  const [inputValue, setInputValue] = useState(""); // State for input field
  const [emoji, setEmoji] = useState("😊"); // Default emoji

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      setMessages([...messages, { text: inputValue, emoji }]); // Add message with selected emoji
      setInputValue(""); // Clear the input field
    }
  };
  return (
    <div className="absolute inset-0 -z-20 w-full min-h-screen bg-transparent bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4">
      <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with Home link */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-3xl font-bold">Live Chat</h2>
          <Link to="/home" aria-label="Go to Home">
            <span className="text-xl">🏠</span> {/* Home icon */}
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-4">This is where the live chat functionality will be.</p>

          {/* Scrollable area for messages */}
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded shadow">
                  <span>{msg.emoji}</span> {msg.text}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Input area for sending messages */}
        <div className="flex items-center p-4 bg-gray-50 border-t">
          {/* Emoji selection */}
          <button
            onClick={() => setEmoji(emoji === "😊" ? "😂" : "😊")} // Toggle between two emojis for simplicity
            className="text-xl mr-2"
            aria-label="Select Emoji"
          >
            {emoji}
          </button>
          
          {/* Text input field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded p-2 mr-2"
          />
          
          {/* Send button */}
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;