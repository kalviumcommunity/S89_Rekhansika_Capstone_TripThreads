const express = require("express");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

const authenticateToken = require("../middleware/auth");


// Signup Route
userRouter.post("/signup", async (req, res) => {
    try {
        const { name, email, password ,confirmPassword } = req.body;

        // Validate input
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All details are required" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User Already Registered" });
        }

        // Hash password securely
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign(
            { name: newUser.name, email: newUser.email, id: newUser._id },
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );

        return res.status(201).json({
            message: "User registered successfully",
            token,
            name: newUser.name,
            id: newUser.id,
        });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Login Route
userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All details are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const matchedPass = bcrypt.compareSync(password, user.password);
        if (user && matchedPass) {
            const token = jwt.sign(
                { name: user.name, email: user.email, id: user._id },
                process.env.JWT_SECRET,
                {expiresIn: "1d"}
            );
            return res.status(200).json({
                message: "User logged in successfully",
                user: {
        name: user.name,
        email: user.email,
        id: user._id,
        username: user.username || "",
        countries: user.countries || 0,
        cities: user.cities || 0,
        image: user.image || "",
        token // <-- send the JWT to the frontend
    }
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Example: controller/userRouter.js
userRouter.put('/profile', authenticateToken, async (req, res) => {
  const { email, name, username, countries, cities, image } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name, username, countries, cities, image },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = userRouter;