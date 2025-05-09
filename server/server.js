import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store active parties and their members
const parties = new Map();

// Generate a random party ID
const generatePartyId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Handle user joining a party
  socket.on('join_party', ({ partyId, username }) => {
    socket.join(partyId);
    
    // Initialize party if it doesn't exist
    if (!parties.has(partyId)) {
      parties.set(partyId, { users: new Map(), messages: [] });
    }
    
    // Add user to party
    const party = parties.get(partyId);
    party.users.set(socket.id, { id: socket.id, username });
    
    // Notify everyone in the party about the new user
    io.to(partyId).emit('user_joined', {
      userId: socket.id,
      username,
      users: Array.from(party.users.values())
    });
    
    // Send party history to the new user
    socket.emit('party_history', {
      messages: party.messages
    });
    
    console.log(`User ${username} joined party ${partyId}`);
  });
  
  // Handle chat messages
  socket.on('send_message', ({ partyId, message }) => {
    const party = parties.get(partyId);
    if (!party) return;
    
    const user = party.users.get(socket.id);
    if (!user) return;
    
    const messageData = {
      id: Date.now().toString(),
      userId: socket.id,
      username: user.username,
      text: message,
      timestamp: new Date().toISOString()
    };
    
    // Store message in party history
    party.messages.push(messageData);
    if (party.messages.length > 100) {
      party.messages.shift(); // Keep only the last 100 messages
    }
    
    // Broadcast message to everyone in the party
    io.to(partyId).emit('receive_message', messageData);
    console.log(`Message from ${user.username} in party ${partyId}: ${message}`);
  });
  
  // Handle creating a new party
  socket.on('create_party', ({ username }) => {
    const partyId = generatePartyId();
    
    // Notify the user about the new party
    socket.emit('party_created', { partyId });
    console.log(`New party created: ${partyId} by ${username}`);
  });
  
  // Handle user leaving a party
  socket.on('leave_party', ({ partyId }) => {
    const party = parties.get(partyId);
    if (!party) return;
    
    const user = party.users.get(socket.id);
    if (!user) return;
    
    // Remove user from party
    party.users.delete(socket.id);
    socket.leave(partyId);
    
    // Notify others that user has left
    io.to(partyId).emit('user_left', {
      userId: socket.id,
      username: user.username,
      users: Array.from(party.users.values())
    });
    
    // Clean up empty parties
    if (party.users.size === 0) {
      parties.delete(partyId);
      console.log(`Party ${partyId} deleted (empty)`);
    }
    
    console.log(`User ${user.username} left party ${partyId}`);
  });
  
  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove user from all parties they were in
    parties.forEach((party, partyId) => {
      if (party.users.has(socket.id)) {
        const username = party.users.get(socket.id).username;
        party.users.delete(socket.id);
        
        // Notify others that user has left
        io.to(partyId).emit('user_left', {
          userId: socket.id,
          username,
          users: Array.from(party.users.values())
        });
        
        // Clean up empty parties
        if (party.users.size === 0) {
          parties.delete(partyId);
          console.log(`Party ${partyId} deleted (empty)`);
        }
        
        console.log(`User ${username} disconnected from party ${partyId}`);
      }
    });
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Lofi Beats Chat Server is running');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});