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
    title:{
        type: String,
        required: true,
        trim: true
    },
    content:{
        type: String,
        required: true
    },
    tags: {
        type: [String], 
        default: []
    },
},{
    timestamps:true
});

const communityPost = mongoose.model("Community",communityPostSchema);
const post = mongoose.model("Personal",postSchema);

module.exports = {communityPost , post}