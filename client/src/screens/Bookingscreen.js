import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import Loader from "../components/Loader";

function Bookingscreen() {
    const { roomid, fromdate, todate } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totaldays, setTotaldays] = useState(0);
    const [totalamount, setTotalamount] = useState(0);

    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        async function fetchRoom() {
            try {
                const res = await axios.post("/api/rooms/getroombyid", { roomid });
                setRoom(res.data);

                const days =
                    moment(todate, "DD-MM-YYYY").diff(
                        moment(fromdate, "DD-MM-YYYY"),
                        "days"
                    ) + 1;
                setTotaldays(days);
                setTotalamount(days * res.data.rentperday);
                setLoading(false);
            } catch (err) {
                console.error("Room fetch error:", err);
                setLoading(false);
            }
        }

        fetchRoom();
    }, [roomid, fromdate, todate, navigate, user]);

    function loadRazorpayScript() {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            document.body.appendChild(script);
        });
    }

    async function bookRoom() {
        await loadRazorpayScript();

        const options = {
            key: "rzp_test_NjBFfs7DcjNidl", // test key
            amount: totalamount * 100,
            currency: "INR",
            name: "Hotel Booking",
            description: "Room Booking Transaction",
            image: "/logo192.png",
            handler: async function (response) {
                try {
                    await axios.post("/api/bookings/bookroom", {
                        room,
                        userid: user._id,
                        fromdate,
                        todate,
                        totalamount,
                        totaldays,
                        razorpay_payment_id: response.razorpay_payment_id,
                    });
                    alert("Payment & booking successful!");
                    navigate("/profile");
                } catch (err) {
                    alert("Payment succeeded but booking failed!");
                }
            },
            prefill: {
                name: user?.name,
                email: user?.email,
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    return loading ? (
        <Loader />
    ) : (
        <div className="row m-5">
            <div className="col-md-6">
                <h2>{room.name}</h2>
                {room.imageurls && room.imageurls.length > 0 ? (
                    <img
                        src={`/${room.imageurls[0]}`}
                        className="bigimg"
                        alt="room" style={{ width: "500px", height: "350px", borderRadius: "10px" }}
                    />
                ) : (
                    <p>No image available</p>
                )}
            </div>
            <div className="col-md-6">
                <h2>Booking Details</h2>
                <hr />
                <b>


                    <p>
                        <span style={{ fontWeight: "bold", color: "#000" }}>Name:</span>{" "}
                        <span style={{ fontWeight: "normal", color: "#000" }}>{user?.name}</span>
                    </p>
                    <p>
                        <span style={{ fontWeight: "bold", color: "#000" }}>Email:</span>{" "}
                        <span style={{ fontWeight: "normal", color: "#000" }}>{user?.email}</span>
                    </p>
                    <p>
                        <span style={{ fontWeight: "bold", color: "#000" }}>From:</span>{" "}
                        <span style={{ fontWeight: "normal", color: "#000" }}>{fromdate}</span>
                    </p>
                    <p>
                        <span style={{ fontWeight: "bold", color: "#000" }}>To:</span>{" "}
                        <span style={{ fontWeight: "normal", color: "#000" }}>{todate}</span>
                    </p>
                    <p>
                        <span style={{ fontWeight: "bold", color: "#000" }}>Total Days:</span>{" "}
                        <span style={{ fontWeight: "normal", color: "#000" }}>{totaldays}</span>
                    </p>
                </b>
                <div>
                    <h2>Amount</h2>
                    <hr />
                    <b>
                        <p>
                            <span style={{ fontWeight: "bold", color: "#000" }}>Rent per day:</span>{" "}
                            <span style={{ fontWeight: "normal", color: "#000" }}> ₹{room.rentperday}</span>
                        </p>
                        <p>
                            <span style={{ fontWeight: "bold", color: "#000" }}>Total amount:</span>{" "}
                            <span style={{ fontWeight: "normal", color: "#000" }}> ₹{totalamount}</span>
                        </p>
                    </b>
                </div>
                <div style={{ float: "right" }}>
                    <button className="btn btn-primary" onClick={bookRoom}>
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Bookingscreen;




