const express = require("express");
const app = express();

const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

const cors = require('cors');
app.use(cors());

const chatbotRouter = require("./controller/chatbotRouter");
const locationSearchRouter = require("./controller/locationSearchRouter");
const socialFeaturesRouter = require("./controller/socialFeaturesRouter");
const navigationRouter = require("./controller/navigationRouter");
const userRouter = require("./controller/userRouter");  

app.use("/api/chatbot",chatbotRouter);
app.use("/locationSearch",locationSearchRouter);
app.use("/socialFeatures",socialFeaturesRouter);
app.use("/navigation",navigationRouter);
app.use("/user",userRouter);

app.get("/", (req, res) => {
    res.send("TripThreads backend is running!");
});


app.listen(3000,async()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Server running on port 3000");
    } catch (error) {
        console.log(error);
        console.log("Error",error)
    }
});