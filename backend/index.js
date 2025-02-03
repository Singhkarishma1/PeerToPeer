const express = require('express');
const cors = require('cors'); // Import cors
require('dotenv').config();
const authUser = require('./routes/userRoutes'); // Import the routes from userRoutes.js
const connectDB = require('./config/dbConfig'); // Import the connectDB function from dbConfig.js
const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration to allow requests from localhost:5173 and localhost:5174
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies to be sent with requests
};

// Apply CORS middleware to the app
app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();
// Middleware
app.use(express.json());

// Use the imported route handler for /api
app.use('/api', authUser); // Use the `authUser` route for any request to /api

// Start Server
app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});
