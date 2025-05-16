const express = require("express");
const app = express();

const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

const cors = require('cors');
app.use(cors());


const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Session middleware
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.callbackURL,
  },
  function(accessToken, refreshToken, profile, cb) {
    // Here you would find or create a user in your database
    // For now, we'll just pass the profile info
    return cb(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google Auth Endpoints
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  function(req, res) {
    // Redirect to frontend after successful login
    res.redirect('http://localhost:5173/home');
  }
);

// Auth status route for frontend authentication check
app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

app.get("/ping",(req,res)=>{
    return res.status(200).send("pong");
})


const chatbotRouter = require("./controller/chatbotRouter");
const locationSearchRouter = require("./controller/locationSearchRouter");
const socialFeaturesRouter = require("./controller/socialFeaturesRouter");
const navigationRouter = require("./controller/navigationRouter");
const userRouter = require("./controller/userRouter");  

app.get("/", (req, res) => {
    res.send("TripThreads backend is running!");
});

app.use("/api/chatbot",chatbotRouter);
app.use("/locationSearch",locationSearchRouter);
app.use("/socialFeatures",socialFeaturesRouter);
app.use("/navigation",navigationRouter);
app.use("/user",userRouter);




app.listen(3000,async()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Server running on port 3000");
    } catch (error) {
        console.log(error);
        console.log("Error",error)
    }

});


