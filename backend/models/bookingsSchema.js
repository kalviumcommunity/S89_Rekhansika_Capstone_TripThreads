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
        required: true,
        validate: {
            validator: function (value) {
                return value.getTime() > this.start_date.getTime();
            },
            message: "End date must be after start date"
        }
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
        required: true,
        validate: {
            validator: function (value) {
                return value.getTime() > this.start_date.getTime();
            },
            message: "End date must be after start date"
        }
    },
    location: {
        type: String,
        required: true
    }
});

const bookingSchema = new mongoose.Schema({
    transportation: transportationSchema,
    hotels: [hotelSchema]
}, { timestamps: true }); 

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;