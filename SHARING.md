# Sharing Your Lofi Beats App on Your Local Network

## Overview

This guide explains how to share your Lofi Beats App with other devices on your local network. This allows friends, family, or colleagues to access and use the app from their devices (phones, tablets, laptops) as long as they're connected to the same WiFi network.

## How It Works

The app has been configured to automatically detect your local IP address and make the server accessible to other devices on your network. When you start the server, it will display a shareable link that you can send to others.

## Steps to Share

1. **Start the server**
   ```
   node server.js
   ```

2. **Look for the shareable link in the console**
   The server will display a message like this:
   ```
   ✅ SHAREABLE LINK: http://192.168.1.X:3000
   ```
   (where 192.168.1.X is your actual local IP address)

3. **Share this link with others**
   - Send the link via message, email, or any other method
   - Make sure the recipients are connected to the same WiFi network as your server

## Requirements for Sharing

- Both your device and the recipient's device must be connected to the same WiFi network
- Your firewall must allow connections on port 3000
- The server must be running on your device while others are using the app

## Troubleshooting

- **Can't connect?** Make sure both devices are on the same network
- **Link not working?** Check that your firewall isn't blocking port 3000
- **App not loading?** Ensure the server is still running on your device

## Security Note

This sharing method is intended for local network use only. The app is not secured for public internet access. Never expose this app to the public internet without implementing proper security measures.