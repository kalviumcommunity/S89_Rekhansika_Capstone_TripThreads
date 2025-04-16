const mongoose = require('mongoose');

const locationInsightSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        ref: 'User'
    },
    locationName: {
        type: String,
        required: true,
        trim: true
    },
    attractions: {
        type: [String],
        default: []
    },
    cuisines: {
        type: [String], 
        default: []
    },
    weatherDetails: {
        type: String,
    },
    languageInfo: {
        type: [String], 
        default: []
    },
    activities: {
        type: [String], 
        default: [],
    },
    budgetRange: {
        type: String,
        required: true,
        trim: true,
    }
},{
    timestamps:true
});

const locationInsight = mongoose.model('LocationInsight', locationInsightSchema);
module.exports = locationInsight;