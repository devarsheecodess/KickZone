import React, { useState } from "react";

const PollingPage = () => {
  const [question, setQuestion] = useState("");
  const [polls, setPolls] = useState([]);

  const handleAddPoll = () => {
    if (question.trim() !== "") {
      setPolls([...polls, question]);
      setQuestion(""); // Clear the input field after adding
    }
  };

  return (
    <div className="absolute inset-0 -z-20 w-full min-h-screen bg-transparent bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4">
      <div className="w-full max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Create a Poll</h2>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter your poll question"
        />
        <button
          onClick={handleAddPoll}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Add Poll
        </button>
      </div>

      {/* Scrollable Polls Section */}
      <div className="flex-1 overflow-y-auto bg-red-500 p-6 rounded-md w-full">
        <h2 className="text-xl font-bold mb-4">Polls</h2>
        <div className="space-y-4">
          {polls.length === 0 ? (
            <p>No polls added yet.</p>
          ) : (
            polls.map((poll, index) => (
              <div key={index} className="bg-white p-4 rounded shadow">
                {poll}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PollingPage;