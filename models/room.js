const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    maxCount: { type: Number, required: true },
    rentPerDay: { type: Number, required: true },
    imageUrls: [],
    currentBookings: [],
    description: { type: String, required: true },
    type: { type: String, required: true }
}, { strict: false });  // ✅ You add this here (after the closing bracket of fields)

const Room = mongoose.model("rooms", roomSchema);

module.exports = Room;
