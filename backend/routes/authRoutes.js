const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'https://s89-rekhansika-capstone-trip-threads-ncd6-jv2f93y3g.vercel.app/login' }),
  function(req, res) {
    // Redirect to frontend after successful login
    res.redirect('https://s89-rekhansika-capstone-trip-threads-ncd6-jv2f93y3g.vercel.app/home');
  }
);

// Auth status route for frontend authentication check
router.get('/status', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
