const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const moment = require("moment");

// ⚠️ Replace with your exact Test Secret Key from Stripe (Test Mode ON)
const stripe = require("stripe")("sk_test_YOUR_SECRET_KEY");

router.post("/bookroom", async (req, res) => {
    const { token, room, userid, fromdate, todate, totalamount, totaldays } = req.body;

    try {
        // 1️⃣ Charge the card
        const charge = await stripe.charges.create({
            amount: totalamount * 100,         // paise
            currency: "inr",
            source: token.id,                  // from Stripe pop‑up
            description: `Booking ${room.name}`,
        });

        // 2️⃣ Save booking to MongoDB
        const newBooking = new Booking({
            room: room.name,
            roomid: room._id,
            userid,
            fromdate,
            todate,
            totalamount,
            totaldays,
            transactionId: charge.id,           // Stripe charge ID
        });
        const saved = await newBooking.save();

        // 3️⃣ Update room’s current bookings
        const roomDoc = await Room.findById(room._id);
        roomDoc.currentbookings.push({
            bookingid: saved._id,
            fromdate: moment(fromdate).format("DD-MM-YYYY"),
            todate: moment(todate).format("DD-MM-YYYY"),
            userid,
            status: saved.status,
        });
        await roomDoc.save();

        res.send({ success: true, booking: saved });
    } catch (err) {
        console.error("Booking/Stripe error:", err);
        res.status(500).send({ error: "Booking failed" });
    }
});

module.exports = router;
