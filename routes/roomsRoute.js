const express = require("express");
const router = express.Router();
const Room = require("../models/room");

// GET all rooms
router.get("/getallrooms", async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.send(rooms);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// GET room by ID
router.post("/getroombyid", async (req, res) => {
    const roomid = req.body.roomid;
    try {
        const room = await Room.findOne({ _id: roomid });
        res.send(room);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// ✅ ADD ROOM
router.post("/addroom", async (req, res) => {
    try {
        const newroom = new Room(req.body);
        await newroom.save();
        res.send("Room added successfully");
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = router;
