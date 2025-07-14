const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        maxcount: { type: Number, required: true },
        phonenumber: { type: String, required: true },
        rentperday: { type: Number, required: true },
        type: { type: String, required: true },
        description: { type: String, required: true },
        imageurls: [{ type: String }],
        currentbookings: [],
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model("rooms", roomSchema);
module.exports = Room;
