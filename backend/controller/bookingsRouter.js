const express = require('express');
const Booking = require('../models/bookingsSchema');
const { sendConfirmationEmail } = require("../utils/mailer");

const bookingsRouter = express.Router();

// Create a new booking
bookingsRouter.post('/book', async (req, res) => {
     console.log('POST /api/bookings/book called', req.body); // Add this line
    const { userEmail, transportation, hotels } = req.body;

    try {
        const newBooking = new Booking({ userEmail, transportation, hotels });
        await newBooking.save();
        console.log('Booking saved:', newBooking); // <-- Add this

        // Send confirmation email
        await sendConfirmationEmail(userEmail, newBooking);

        res.status(201).json({ message: 'Booking successful!', booking: newBooking });
    } catch (error) {
        console.error('Booking error:', error); // Add this line
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});

// Fetch booking history for a user
bookingsRouter.get('/history/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const bookings = await Booking.find({ userEmail: email });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking history', error: error.message });
    }
});

module.exports = bookingsRouter;