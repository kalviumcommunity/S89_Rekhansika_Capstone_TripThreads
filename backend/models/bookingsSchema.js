const mongoose = require("mongoose");

const transportationSchema = new mongoose.Schema({
    mode_of_transportation: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

const hotelSchema = new mongoose.Schema({
    type_of_hotel: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

const bookingsSchema = new mongoose.Schema({
    transportation: transportationSchema,
    hotels: hotelSchema
});

const bookings = mongoose.model("bookings", bookingsSchema);
module.exports = bookings;