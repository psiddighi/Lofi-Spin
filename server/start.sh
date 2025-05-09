#!/bin/bash

# Start the Lofi Beats Chat Server
echo "Starting Lofi Beats Chat Server..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the server
echo "Starting server on port 3001..."
npm run dev