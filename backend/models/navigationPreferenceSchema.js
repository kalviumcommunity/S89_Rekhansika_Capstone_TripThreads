const mongoose = require('mongoose');

const navigationPreferenceSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        ref: 'User'
    },
    preferredRoutes: {
        type: [String], 
        default: []
    },
    transportOptions: {
        type: [String], 
        default: []
    },
    mapDirections: {
        type: String, 
        required: true,
        trim: true
    }
},{
    timestamps:true
});

const navigationPreference = mongoose.model('NavigationPreference', navigationPreferenceSchema);
module.exports = navigationPreference;