// Import necessary libraries
const express = require('express');
const cors = require('cors');

// Initialize the Express app
const app = express();

// THIS IS THE FIX FOR THE PORT.
// It uses Render's port, or 3000 on your local computer.
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- API Endpoint for Subscribing ---
// This handles POST requests from your website
app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  // Validate the email
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  // THIS IS THE FIX FOR FILE SAVING.
  // We will just log the email instead of saving it to a file.
  // You will be able to see these logs on the Render website.
  console.log(`New subscription received: ${email}`);

  // Send a success response back to the frontend
  res.status(201).json({ message: 'Thank you! You have been successfully subscribed.' });
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
