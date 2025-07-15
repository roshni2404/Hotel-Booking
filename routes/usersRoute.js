const express = require("express");
const router = express.Router();
const User = require("../models/user");

// ✅ Register User
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const newuser = new User({ name, email, password });

    try {
        await newuser.save();
        res.send({ message: "User Registered Successfully" });
    } catch (error) {
        return res.status(400).json({ error });
    }
});

// ✅ Login User
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            const temp = {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                _id: user._id,
            };
            res.send(temp);
        } else {
            return res.status(400).json({ message: "Login failed" });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

// ✅ Get All Users (for Admin Panel)
router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

module.exports = router;
