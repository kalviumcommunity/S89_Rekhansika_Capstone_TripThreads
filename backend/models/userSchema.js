const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: { 
    type: String, trim: true
   }, 
  image: { 
    type: String 
  },
  countries: { 
    type: Number, default: 0 
  },
  cities: {
    type: Number, default: 0
  },
   image: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "userData" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "userData" }]
}, { timestamps: true });

const User = mongoose.model("userData", userSchema);

module.exports = User;