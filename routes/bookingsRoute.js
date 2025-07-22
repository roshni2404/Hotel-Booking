const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const moment = require("moment");

const Booking = require("../models/booking");
const Room = require("../models/room");

// Razorpay setup
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY || "rzp_test_NjBFfs7DcjNidl",
    key_secret: process.env.RAZORPAY_SECRET || "ZBVEjODsAGjdJMquosgTHVun",
});

// =============================
// 1. Create Razorpay Order
// =============================
router.post("/create-order", async (req, res) => {
    const { amount } = req.body;

    try {
        const order = await razorpay.orders.create({
            amount: amount * 100, // amount in paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
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

// =============================
// 2. Book Room After Payment
// =============================
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

// =============================
// 3. Get Bookings by User ID
// =============================
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

// =============================
// 4. Cancel Booking
// =============================
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

// =============================
// 5. Get All Bookings
// =============================
router.get("/getallbookings", async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;
