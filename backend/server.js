require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth'); // Import the authentication routes
const path = require('path'); // For handling file paths

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // To parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));  // To parse URL-encoded data (for form submission)

// Routes
app.use('/api', require('./routes/auth')); // Register authentication routes

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));