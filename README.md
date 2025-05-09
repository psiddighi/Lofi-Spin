# Lofi Beats App with MongoDB Integration

This project is a Lofi beats streaming application with MongoDB integration for user accounts and favorite stations.

## Features

- User authentication (register, login, logout)
- Save favorite stations to your account
- Lofi music streaming from various stations
- Different visual skins/themes
- Responsive design

## Project Structure

- `lofi-spin-vibes-menu-main/`: Frontend React application
- `server.js`: Backend Express server with MongoDB integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- XAMPP (for local development)

## Setup Instructions

### 1. Install Dependencies

Install backend dependencies:
```bash
cd "/Applications/XAMPP/xamppfiles/htdocs/Lofi beats app"
npm install
```

Install frontend dependencies:
```bash
cd "/Applications/XAMPP/xamppfiles/htdocs/Lofi beats app/lofi-spin-vibes-menu-main"
npm install
```

### 2. Configure MongoDB

Make sure MongoDB is running on your system. The default connection string is `mongodb://localhost:27017/lofi-app`.

You can modify the connection string in the `.env` file if needed.

### 3. Start the Backend Server

```bash
cd "/Applications/XAMPP/xamppfiles/htdocs/Lofi beats app"
node server.js
```

The server will start on port 5000 by default.

### 4. Start the Frontend Application

```bash
cd "/Applications/XAMPP/xamppfiles/htdocs/Lofi beats app/lofi-spin-vibes-menu-main"
npm run dev
```

The frontend will start on port 5173 by default.

## API Endpoints

### Authentication

- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Login a user
- `GET /api/users/me`: Get current user info (requires authentication)

### Favorites

- `GET /api/favorites`: Get user's favorite stations (requires authentication)
- `POST /api/favorites`: Add a station to favorites (requires authentication)
- `DELETE /api/favorites/:stationId`: Remove a station from favorites (requires authentication)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lofi-app
JWT_SECRET=your-secret-key
```

## Security Notes

- In a production environment, make sure to use a strong JWT secret
- Consider implementing rate limiting for API endpoints
- Use HTTPS in production

## License

This project is licensed under the MIT License.