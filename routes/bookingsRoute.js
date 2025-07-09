// routes/razorpayRoute.js

const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const crypto = require("crypto");

// ✅ Initialize Razorpay with your test keys
const razorpay = new Razorpay({
    key_id: "rzp_test_wYPyMDh1rocbA4",
    key_secret: "NDONHAZF4QIGN1c3ch9mokOk",
});

// ✅ Create Razorpay order route
router.post("/create-order", async (req, res) => {
    const { room, userid, fromdate, todate, totalamount, totaldays } = req.body;

    const options = {
        amount: totalamount * 100, // Amount in paisa
        currency: "INR",
        receipt: `receipt_${Date.now()
            }`,
        notes: {
            roomid: room._id,
            userid,
            fromdate,
            todate,
            totalamount,
            totaldays,
        },
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        res.status(500).json({ success: false, error: "Failed to create Razorpay order" });
    }
});

module.exports = router;