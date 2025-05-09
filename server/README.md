# Lofi Beats Chat Server

This is the real-time chat server for the Lofi Beats application. It enables users to create listening parties and chat with others while enjoying the same music.

## Features

- Real-time chat using Socket.IO
- Create and join listening parties
- User presence tracking (join/leave notifications)
- Message history for each party

## Technical Implementation

- Built with Express.js and Socket.IO
- Stores chat messages and user information in memory
- Handles party creation, joining, and leaving
- Manages user disconnections gracefully

## Getting Started

### Prerequisites

- Node.js (v14 or higher)

### Installation

```bash
# Install dependencies
npm install

# Start the server
npm start

# Start the server with auto-reload (development)
npm run dev
```

## API

### Socket.IO Events

#### Client to Server

- `create_party`: Create a new listening party
- `join_party`: Join an existing party
- `leave_party`: Leave the current party
- `send_message`: Send a chat message to the current party

#### Server to Client

- `party_created`: Notification of a new party creation
- `user_joined`: Notification when a user joins a party
- `user_left`: Notification when a user leaves a party
- `receive_message`: Incoming chat message
- `party_history`: History of messages when joining a party

## Integration with Frontend

The frontend React application connects to this server using the Socket.IO client. The connection is managed in the ChatContext provider component.