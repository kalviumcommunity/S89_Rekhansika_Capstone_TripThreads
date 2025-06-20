const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL // e.g., 'https://yourdomain.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));




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
     // Generate JWT
    const token = jwt.sign(
      { email: req.user.emails[0].value, name: req.user.displayName, id: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // Redirect to frontend after successful login
    res.redirect(`http://localhost:5173/google-success?token=${token}&name=${encodeURIComponent(req.user.displayName)}&email=${encodeURIComponent(req.user.emails[0].value)}`);
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
const bookingsRouter = require('./controller/bookingsRouter');


app.get("/", (req, res) => {
    res.send("TripThreads backend is running!");
});

app.use("/api/chatbot",chatbotRouter);
app.use("/locationSearch",locationSearchRouter);
app.use("/socialFeatures",socialFeaturesRouter);
app.use("/navigation",navigationRouter);
app.use("/user",userRouter);
app.use("/api/bookings", bookingsRouter);




app.listen(3000,async()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Server running on port 3000");
    } catch (error) {
        console.log(error);
        console.log("Error",error)
    }

});