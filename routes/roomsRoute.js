const express = require("express");
const router = express.Router();

const Room = require('../models/room')

router.get("/getallrooms", async (req, res) => {

    try {
        const rooms = await Room.find({});
        console.log("Rooms from DB:", rooms);
        res.json(rooms);
    } catch (error) {
        console.log("Error fetching rooms:", error);
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;