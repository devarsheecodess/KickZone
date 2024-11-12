const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for Express and Socket.IO
app.use(cors());
app.use(express.static('public'));

// Initialize Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Create separate namespaces for different features
const chatIO = io.of('/chat');
const meetIO = io.of('/meet');

// Store active rooms and their participants
const rooms = new Map();

// WebSocket server for polls (separate from Socket.IO)
const wss = new WebSocket.Server({ server, path: "/polls" });
let polls = {};

// Polls WebSocket Handler
wss.on('connection', (ws) => {
    console.log('A user connected to polls');

    // Send existing polls to the newly connected client
    ws.send(JSON.stringify({ type: 'polls', data: polls }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'createPoll':
                polls[data.pollId] = {
                    question: data.question,
                    options: data.options,
                    votes: new Array(data.options.length).fill(0)
                };
                broadcastPolls();
                break;

            case 'vote':
                if (polls[data.pollId]) {
                    polls[data.pollId].votes[data.optionIndex]++;
                    broadcastPolls();
                }
                break;
        }
    });

    ws.on('close', () => {
        console.log('A user disconnected from polls');
    });
});

function broadcastPolls() {
    const message = JSON.stringify({ type: 'polls', data: polls });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Chat Handler (Separate namespace)
// Chat Handler (Separate namespace)
chatIO.on('connection', (socket) => {
  console.log('A user connected to chat');

  socket.on('chatMessage', (msg) => {
      chatIO.emit('chatMessage', msg); // Broadcast only to chat users
  });

  socket.on('disconnect', () => {
      console.log('User disconnected from chat');
  });
});

// Meeting Handler (Separate namespace)
meetIO.on('connection', (socket) => {
    console.log('A user connected to meeting:', socket.id);

    // Join meeting room
    socket.on('joinRoom', (roomId, userId) => {
        console.log(`User ${userId} joining room ${roomId}`);
        
        socket.join(roomId);
        
        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
        }
        
        // Add user to room
        rooms.get(roomId).add(userId);
        
        // Notify others in room about new participant
        socket.to(roomId).emit('userJoined', {
            userId: userId,
            participants: Array.from(rooms.get(roomId))
        });
        
        // Send current participants to new user
        socket.emit('roomInfo', {
            participants: Array.from(rooms.get(roomId))
        });
    });

    // Handle WebRTC signaling
    socket.on('offer', (data) => {
        console.log(`Relaying offer from ${data.userId} to room ${data.roomId}`);
        socket.to(data.roomId).emit('offer', {
            offer: data.offer,
            userId: data.userId
        });
    });

    socket.on('answer', (data) => {
        console.log(`Relaying answer from ${data.userId} to room ${data.roomId}`);
        socket.to(data.roomId).emit('answer', {
            answer: data.answer,
            userId: data.userId
        });
    });

    socket.on('iceCandidate', (data) => {
        console.log(`Relaying ICE candidate from ${data.userId} to room ${data.roomId}`);
        socket.to(data.roomId).emit('iceCandidate', {
            candidate: data.candidate,
            userId: data.userId
        });
    });

    // Handle user leaving meeting
    socket.on('leaveRoom', (roomId, userId) => {
        handleUserLeaveRoom(socket, roomId, userId);
    });

    socket.on('disconnect', () => {
        // Find and remove user from all rooms they were in
        rooms.forEach((participants, roomId) => {
            if (participants.has(socket.id)) { // Check if the user is in this room
                handleUserLeaveRoom(socket, roomId, socket.id);
            }
        });
        console.log('User disconnected from meeting:', socket.id);
    });
});

function handleUserLeaveRoom(socket, roomId, userId) {
    console.log(`User ${userId} leaving room ${roomId}`);
    
    socket.leave(roomId);
    
    const roomParticipants = rooms.get(roomId);
    
    if (roomParticipants) {
        roomParticipants.delete(userId); // Remove the user from the set
        
        if (roomParticipants.size === 0) { 
            rooms.delete(roomId); // Remove the room if no participants are left
            console.log(`Room ${roomId} has been deleted as it is empty.`);
        } else { 
            // Notify others that the user has left
            socket.to(roomId).emit('userLeft', {
                userId: userId,
                participants: Array.from(roomParticipants)
            });
            console.log(`User ${userId} has left room ${roomId}.`);
        }
    }
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});