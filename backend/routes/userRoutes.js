const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        user = new User({ name, email, password: hashedPassword });
        console.log(user);
        await user.save();
        console.log("User registered successfully");

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login User
router.post('/signin', async (req, res) => {
    console.log("Sign in request received");
    console.log(req.body);
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        console.log(user);
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        console.log(process.env.JWT_SECRET);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log(token);
        //setting the token in the cookie
        
        res.cookie('token', token, { httpOnly: true });

        return res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

//logOut User
router.get('/logout', async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
