const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for Express and Socket.IO
app.use(cors());
app.use(express.static('public'));  // Serve frontend from 'public' folder

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// WebSocket server for polls
const wss = new WebSocket.Server({ server, path: "/polls" });
let polls = {}; // Store polls and their votes

wss.on('connection', (ws) => {
    console.log('A user connected to polls');

    // Send existing polls to the newly connected client
    ws.send(JSON.stringify({ type: 'polls', data: polls }));

    // Listen for messages from clients
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'createPoll':
                // Create a new poll
                polls[data.pollId] = { question: data.question, options: data.options, votes: new Array(data.options.length).fill(0) };
                broadcastPolls();
                break;

            case 'vote':
                // Record a vote for a poll option
                if (polls[data.pollId]) {
                    polls[data.pollId].votes[data.optionIndex]++;
                    broadcastPolls();
                }
                break;
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('A user disconnected from polls');
    });
});

// Function to broadcast polls to all WebSocket clients
function broadcastPolls() {
    const message = JSON.stringify({ type: 'polls', data: polls });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Socket.IO connection for live chat
io.on('connection', (socket) => {
  console.log('A user connected to live chat');

  // Join a specific room (for WebRTC)
  socket.on('join', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Listen for chat messages from clients
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg); // Broadcast message to all clients
  });

  // Handle WebRTC offer from a user
  socket.on('offer', (roomId, offer) => {
    socket.to(roomId).emit('offer', offer);
  });

  // Handle WebRTC answer from a user
  socket.on('answer', (roomId, answer) => {
    socket.to(roomId).emit('answer', answer);
  });

  // Handle ICE candidate
  socket.on('candidate', (roomId, candidate) => {
    socket.to(roomId).emit('candidate', candidate);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected from live chat or virtual meeting');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('WebSocket server for polls is available on ws://localhost:5000/polls');
});
