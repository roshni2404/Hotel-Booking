const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Register Route
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const newuser = new User({ name, email, password });

    try {
        await newuser.save();
        res.send({ message: "User Registered Successfully" }); // ✅ proper response
    } catch (error) {
        return res.status(400).json({ error });
    }
});

// Login Route (optional fix)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.send(user);
        } else {
            return res.status(400).json({ message: "Login failed" });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

module.exports = router;
