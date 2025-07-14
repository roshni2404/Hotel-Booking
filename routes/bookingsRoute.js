const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const moment = require("moment");

const Booking = require("../models/booking"); // ✅ Make sure file is booking.js
const Room = require("../models/room");

// ✅ Razorpay Setup
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY || "rzp_test_yiIVbx1oVajdU6",
    key_secret: process.env.RAZORPAY_SECRET || "EAhnPDnzzikRHN3cM5gNu0M4",
});

// ✅ Create Razorpay Order
router.post("/create-order", async (req, res) => {
    const { room, userid, fromdate, todate, totalamount, totaldays } = req.body;

    try {
        const order = await razorpay.orders.create({
            amount: totalamount * 100,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
            notes: {
                roomid: room._id,
                userid,
                fromdate,
                todate,
                totalamount,
                totaldays,
            },
        });

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (err) {
        console.error("Razorpay Order Error:", err.message);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
});

// ✅ Book Room
router.post("/bookroom", async (req, res) => {
    const {
        room,
        userid,
        fromdate,
        todate,
        totalamount,
        totaldays,
        razorpay_payment_id,
    } = req.body;

    try {
        const booking = new Booking({
            room: room.name,
            roomid: room._id,
            userid,
            fromdate: moment(fromdate, "DD-MM-YYYY").format("YYYY-MM-DD"),
            todate: moment(todate, "DD-MM-YYYY").format("YYYY-MM-DD"),
            totalamount,
            totaldays,
            transactionId: razorpay_payment_id,
        });

        const savedBooking = await booking.save();

        const roomDoc = await Room.findById(room._id);
        roomDoc.currentbookings.push({
            bookingid: savedBooking._id,
            fromdate: savedBooking.fromdate,
            todate: savedBooking.todate,
            userid: savedBooking.userid,
            status: savedBooking.status,
        });

        await roomDoc.save();

        res.status(200).json({ success: true, message: "Room booked successfully" });
    } catch (err) {
        console.error("Booking Error:", err.message);
        res.status(500).json({ success: false, message: "Booking failed" });
    }
});

// ✅ Get Bookings by User
router.post("/getbookingsbyuserid", async (req, res) => {
    const { userid } = req.body;

    try {
        const bookings = await Booking.find({ userid }).sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (err) {
        console.error("Get Bookings Error:", err.message);
        res.status(500).json({ success: false, message: "Could not fetch bookings" });
    }
});

// ✅ Cancel Booking
router.post("/cancelbooking", async (req, res) => {
    const { bookingid, roomid } = req.body;

    try {
        const booking = await Booking.findById(bookingid);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        booking.status = "cancelled";
        await booking.save();

        const room = await Room.findById(roomid);
        room.currentbookings = room.currentbookings.filter(
            (b) => b.bookingid.toString() !== bookingid
        );
        await room.save();

        res.status(200).json({ success: true, message: "Booking cancelled successfully" });
    } catch (err) {
        console.error("Cancel Booking Error:", err.message);
        res.status(500).json({ success: false, message: "Cancel failed" });
    }
});

router.get("/getallbookings", async (req, res) => {

    try {
        const bookings = await Booking.find()
        res.send(bookings)
    } catch (error) {
        return res.status(400).json({ error });
    }

});

module.exports = router;
