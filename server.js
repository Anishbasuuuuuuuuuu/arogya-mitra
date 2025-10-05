// server.js - UPDATED WITH RAZORPAY
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Initialize Razorpay ---
// The server will get the keys securely from the Render environment
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- Your existing /subscribe endpoint ---
app.post('/subscribe', (req, res) => {
    // Your existing email subscription logic
    console.log("New subscription request:", req.body.email);
    res.status(201).json({ message: 'Thank you for subscribing!' });
});


// --- NEW PAYMENT ENDPOINT: Create an Order ---
app.post('/create-order', async (req, res) => {
    const options = {
        amount: 29900, // Amount in paise (e.g., 299.00 INR)
        currency: "INR",
        receipt: "receipt_order_74394", // A unique receipt ID
    };
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).send("Error creating order");
    }
});


// --- NEW PAYMENT ENDPOINT: Verify the Payment ---
app.post('/payment-verification', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
        console.log("Payment is authentic");
        // Here is where you would update the user's status in your Firestore database to `isPremium: true`
        res.json({ status: 'success' });
    } else {
        res.status(400).send("Invalid signature");
    }
});


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});