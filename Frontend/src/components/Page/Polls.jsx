import React, { useState, useEffect } from "react";

const PollingPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [polls, setPolls] = useState([]);
  const [ws, setWs] = useState(null); // WebSocket connection
  const [votedPolls, setVotedPolls] = useState(new Set()); // Track voted polls

  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket("https://kickzone-sockets.onrender.com/polls");

    // Set up event listeners for the WebSocket connection
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "polls") {
        setPolls(data.data);
      }
    };

    setWs(socket);

    // Clean up on component unmount
    return () => {
      socket.close();
    };
  }, []);

  const handleAddPoll = () => {
    if (question.trim() !== "" && options.every(option => option.trim() !== "")) {
      const newPollId = Date.now(); // Simple unique ID based on timestamp
      const newPoll = { question, options };

      // Send the new poll to the server
      ws.send(JSON.stringify({ type: "createPoll", pollId: newPollId, question, options }));

      setQuestion("");
      setOptions(["", ""]);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleVote = (pollId, optionIndex) => {
    if (votedPolls.has(pollId)) {
      alert("You have already voted in this poll!");
      return;
    }

    // Send vote to the server
    ws.send(JSON.stringify({ type: "vote", pollId, optionIndex }));

    // Add the poll ID to the voted polls set
    setVotedPolls(new Set(votedPolls).add(pollId));
  };

  return (
    <div className="absolute top-0 left-0 -z-20 w-full min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4">
      <div className="w-full max-w-sm mx-auto my-10 p-6 bg-red-800 rounded-lg shadow-lg border-4 border-yellow-600">
        <h2 className="text-2xl font-bold text-white text-center mb-4">Create a Poll</h2>
        
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your poll question"
          aria-label="Poll Question"
        />
        
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Option ${index + 1}`}
            aria-label={`Poll Option ${index + 1}`}
          />
        ))}

        <button
          onClick={() => setOptions([...options, ""])}
          className="bg-black text-white py-1 px-4 rounded mb-4 hover:bg-gray-600 transition"
        >
          Add Option
        </button>

        <button
          onClick={handleAddPoll}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition"
        >
          Add Poll
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-red-800 p-6 rounded-md w-full h-50 border-4 border-yellow-600">
        <h2 className="text-xl font-bold mb-4 text-white">Polls</h2>
        <div className="space-y-4">
          {polls.length === 0 ? (
            <p className="text-white">No polls added yet.</p>
          ) : (
            Object.keys(polls).map((pollId) => (
              <div key={pollId} className="bg-gray-800 p-6 rounded-lg shadow-lg border-4 border-yellow-600 mb-6">
              <h3 className="font-bold text-red-600 border-b-2 border-yellow-600 pb-2 mb-4 text-lg">
                {polls[pollId].question}
              </h3>
              <ul className="space-y-4">
                {polls[pollId].options.map((option, optionIndex) => (
                  <li key={optionIndex} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                    <span className="font-bold text-red-500">{optionIndex + 1}. {option}</span>
                    <div className="flex items-center">
                      <span className="text-sm text-yellow-400 font-bold mr-2">Votes: {polls[pollId].votes[optionIndex]}</span>
                      <button
                        onClick={() => handleVote(pollId, optionIndex)}
                        className={`bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition ${
                          votedPolls.has(pollId) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={votedPolls.has(pollId)}
                      >
                        Vote
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PollingPage;