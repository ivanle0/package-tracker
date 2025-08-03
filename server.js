// Package Tracker project using Node.js, Express, Socket.io

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// Need to create HTTP server to use with Socket.io
// this is necessary to handle HTTP requests and WebSocket connections
const server = http.createServer(app);   
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// For now just going to store parcels in array
let parcels = [];
let parcelId = 0;

// POST Endpoint to send a new parcel
app.post('/parcel', (req, res) => {
  const { recipient, destination } = req.body;
  if (!recipient || !destination) {
    return res.status(400).json({ error: 'All fields must be filled' });
  }

  const parcel = {
    id: parcelId, 
    recipient: recipient,
    destination: destination,
    status: 'Created',
    history: [{ status: 'Created', timestamp: new Date() }]
  };

  parcels.push(parcel);
  parcelId++;

  io.emit('push-message', `Parcel ID ${parcel.id} for ${parcel.recipient} sent`);
  res.status(201).json(parcel);
});

// PATCH Endpoint to update parcel status









// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected');

  // Listen for messages from the client
  socket.on('client-message', (msg) => {
    console.log('Message from client:', msg);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
