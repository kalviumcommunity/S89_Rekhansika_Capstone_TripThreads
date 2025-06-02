const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema({
    communityName:{
        type: String,
        required: true,
        ref: 'Community'
    },
    userName:{
        type: String,
        required: true,
        ref: 'User'
    },
    title:{
        type: String,
        required: true,
        trim: true,
    },
    content:{
        type:String,
        required:true
    }
});

const postSchema = new mongoose.Schema({

    userName:{
        type: String,
        required: true,
        ref: 'User'
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true
    },
    imageUrl: { type: String, required: true },
  liked: { type: Boolean, default: false },
  date: { type: Date },
  location: { type: String }
},{
    timestamps:true
});

const communityPost = mongoose.model("Community",communityPostSchema);
const post = mongoose.model("user",postSchema);

module.exports = {communityPost , post}