// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Setup Socket.io with CORS enabled
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins or specify your client URL
    methods: ["GET", "POST"]
  }
});

// Middleware to enable CORS
app.use(cors());

// WebSocket connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for chat messages from clients
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg); // Broadcast message to all clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
