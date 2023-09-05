#!/usr/bin/env node

const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const PORT = process.env.PORT || 5000;
const routes = require('./routes/index');

// Middleware to enable CORS
app.use(cors());

// Other middleware and route configurations...

// Load routes from routes/index.js
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

