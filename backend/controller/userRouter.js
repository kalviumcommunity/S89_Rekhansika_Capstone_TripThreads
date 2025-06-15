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
// Example for PUT /user/profile
userRouter.put("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        countries: req.body.countries,
        cities: req.body.cities,
        image: req.body.image,
      },
      { new: true } // <--- THIS IS IMPORTANT
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

userRouter.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Get full follower user objects
userRouter.get("/followers", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("followers", "username name email image");
    res.json(user.followers);
  } catch {
    res.status(500).json({ error: "Failed to fetch followers" });
  }
});

// Get full following user objects
userRouter.get("/following", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("following", "username name email image");
    res.json(user.following);
  } catch {
    res.status(500).json({ error: "Failed to fetch following" });
  }
});

userRouter.get("/profile/:id", authenticateToken, async (req, res) => {
    
  try {
    let projection = "username name image countries cities followers following";
    // Only allow the owner to see their email
    if (req.user.id === req.params.id) {
      projection += " email";
    }
    const user = await User.findById(req.params.id).select(projection);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Get all users except self
userRouter.get("/all", authenticateToken, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }, "name email username image");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Follow a user
userRouter.post("/follow", authenticateToken, async (req, res) => {
  try {
    const toFollowId = req.body.userId;
    const userId = req.user.id;
    if (userId === toFollowId) return res.status(400).json({ error: "Cannot follow yourself" });

    // Add to following and followers arrays
    await User.findByIdAndUpdate(userId, { $addToSet: { following: toFollowId } });
    await User.findByIdAndUpdate(toFollowId, { $addToSet: { followers: userId } });

    res.json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to follow user" });
  }
});

userRouter.post("/unfollow", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const unfollowId = req.body.userId;
    if (userId === unfollowId) {
      return res.status(400).json({ error: "You cannot unfollow yourself." });
    }
    // Remove from following
    await User.findByIdAndUpdate(userId, { $pull: { following: unfollowId } });
    // Remove from followers
    await User.findByIdAndUpdate(unfollowId, { $pull: { followers: userId } });
    res.json({ message: "Unfollowed successfully" });
  } catch {
    res.status(500).json({ error: "Failed to unfollow user" });
  }
});

// Check if following
userRouter.get("/:id/following", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    // Return an array of string IDs
    res.json({ following: user.following.map(id => id.toString()) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch following list" });
  }
});

userRouter.get("/is-following/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isFollowing = user.following.includes(req.params.id);
    res.json({ isFollowing });
  } catch (err) {
    res.status(500).json({ error: "Failed to check following status" });
  }
});



module.exports = userRouter;