const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

// Middleware to parse JSON bodies
app.use(express.json());

// Main route
app.get('/', (req, res) => {
    res.send('Welcome to the Virtual Event Platform API!');
});

// Use authentication routes
app.use('/auth', authRoutes);

module.exports = app;