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

// ✅ Get All Users
router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

// ✅ Make Admin (Move this OUTSIDE)
router.post("/makeadmin", async (req, res) => {
    const { userid } = req.body;

    try {
        const user = await User.findOne({ _id: userid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isAdmin = true;
        await user.save();

        const updatedUser = {
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            _id: user._id,
        };

        res.send(updatedUser);
    } catch (error) {
        console.error("Make Admin Error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
