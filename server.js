// Import necessary libraries
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Initialize the Express app
const app = express();
const PORT = 3000; // The port our server will run on

// Middleware
app.use(cors()); // Allows your frontend to talk to this backend
app.use(express.json()); // Allows the server to understand JSON data sent from the frontend

// Define the path to our simple CSV database file
const DB_PATH = path.join(__dirname, 'subscriptions.csv');

// --- API Endpoint for Subscribing ---
// This handles POST requests to http://localhost:3000/subscribe
app.post('/subscribe', (req, res) => {
  // 1. Get the email from the request body
  const { email } = req.body;

  // 2. Validate the email
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  // 3. Prepare the data to be saved
  const newRecord = `${email},${new Date().toISOString()}\n`;

  try {
    // 4. Check for duplicates (optional but good practice)
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      if (data.includes(email)) {
        return res.status(200).json({ message: 'You are already subscribed!' });
      }
    }

    // 5. Save the new email to the subscriptions.csv file
    fs.appendFileSync(DB_PATH, newRecord);

    // 6. Send a success response back to the frontend
    console.log(`New subscription: ${email}`);
    res.status(201).json({ message: 'Thank you! We\'ll notify you when Arogya Mitra launches.' });

  } catch (error) {
    // Handle any errors that occur while writing to the file
    console.error('Failed to save subscription:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Arogya Mitra backend server is running on http://localhost:${PORT} 🚀`);
});