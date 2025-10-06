// server.js - Cleaned Up Version
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// A simple test endpoint to confirm the server is running
app.get('/', (req, res) => {
    res.send('Arogya Mitra backend is running!');
});

// --- You can add new, non-payment related endpoints here in the future ---


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
