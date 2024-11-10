// server.js
const WebSocket = require('ws');

// Create a WebSocket server listening on port 5000
const wss = new WebSocket.Server({ port: 5000 });

let polls = {}; // Store polls and their votes

wss.on('connection', (ws) => {
    console.log('A user connected');

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
        console.log('A user disconnected');
    });
});

// Function to broadcast polls to all clients
function broadcastPolls() {
    const message = JSON.stringify({ type: 'polls', data: polls });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

console.log('WebSocket server is running on ws://localhost:5000');
