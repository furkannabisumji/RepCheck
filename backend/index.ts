// Import Express
const express = require('express');

// Create an Express application
const app = express();

// Define a port
const PORT = process.env.PORT || 3000;

// Create a GET endpoint
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



