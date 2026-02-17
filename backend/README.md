# CarConnect BE

Backend API for CarConnect application built with Express.js

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## Project Structure

```
carconnect-be/
├── index.js              # Entry point
├── package.json
├── src/
│   ├── app.js           # Express app configuration
│   ├── routes/          # Route definitions
│   ├── controllers/     # Controller logic
│   ├── models/          # Data models
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── config/          # Configuration files
└── public/              # Static files
```

## API Endpoints

- `GET /` - Health check
- `GET /api/health` - API health status
