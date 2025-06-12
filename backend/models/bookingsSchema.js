const mongoose = require("mongoose");

const transportationSchema = new mongoose.Schema({
    mode_of_transportation: {
        type: String,
    },
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date,
        validate: {
            validator: function (value) {
                return value.getTime() > this.start_date.getTime();
            },
            message: "End date must be after start date"
        }
    },
    start_point: { type: String },   // <-- change
    end_point: { type: String }, 
});

const hotelSchema = new mongoose.Schema({
    type_of_hotel: {
        type: String,
    },
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date,
        validate: {
            validator: function (value) {
                return value.getTime() > this.start_date.getTime();
            },
            message: "End date must be after start date"
        }
    },
    location: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const bookingSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    transportation: transportationSchema,
    hotels: [hotelSchema]
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;