import React, { useState, useEffect } from "react";
import { Tabs, Tag } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
import moment from "moment";

const { TabPane } = Tabs;

function Profilescreen() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("1");

    useEffect(() => {
        if (!user) {
            window.location.href = "/login";
        }

        // Load saved tab from localStorage
        const savedTab = localStorage.getItem("profile-tab");
        if (savedTab) {
            setActiveTab(savedTab);
        }
    }, [user]);

    const handleTabChange = (key) => {
        setActiveTab(key);
        localStorage.setItem("profile-tab", key);
    };

    async function makeAdmin() {
        try {
            setLoading(true);
            const result = await axios.post("/api/users/makeadmin", {
                userid: user._id,
            });
            localStorage.setItem("currentUser", JSON.stringify(result.data));
            setLoading(false);
            window.location.reload();
        } catch (error) {
            setLoading(false);
            Swal.fire("Error", "Could not upgrade to admin", "error");
        }
    }

    return (
        <div className="mt-4" style={{ padding: "0 20px" }}>
            {loading && <Loader />}

            <Tabs activeKey={activeTab} onChange={handleTabChange}>
                <TabPane tab="My Profile" key="1">
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                        <div
                            style={{
                                width: "400px",
                                backgroundColor: "#ffffff",
                                padding: "30px",
                                borderRadius: "6px",
                                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)",
                                fontFamily: "'Segoe UI', sans-serif",
                            }}
                        >
                            <p style={{ fontSize: "16px", marginBottom: "10px", fontWeight: 400, color: "#333" }}>
                                <b>Name : {user.name}</b>
                            </p>
                            <p style={{ fontSize: "16px", marginBottom: "10px", fontWeight: 400, color: "#333" }}>
                                <b>Email : {user.email}</b>
                            </p>
                            <p style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 400, color: "#333" }}>
                                <b>Admin Access : {user.isAdmin ? "Yes" : "No"}</b>
                            </p>

                            {!user.isAdmin && (
                                <button
                                    onClick={makeAdmin}
                                    style={{
                                        backgroundColor: "#000",
                                        color: "#fff",
                                        border: "none",
                                        padding: "10px 20px",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    Get Admin Access
                                </button>
                            )}
                        </div>
                    </div>
                </TabPane>

                <TabPane tab="Bookings" key="2">
                    <MyBookings user={user} />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Profilescreen;

// ────────────────────────────────────────────

export function MyBookings({ user }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchBookings() {
            try {
                setLoading(true);
                const response = await axios.post(
                    "/api/bookings/getbookingsbyuserid",
                    { userid: user._id }
                );
                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error);
            }
        }

        if (user && user._id) {
            fetchBookings();
        }
    }, [user]);

    async function cancelBooking(bookingid, roomid) {
        try {
            setLoading(true);
            await axios.post("/api/bookings/cancelbooking", {
                bookingid,
                roomid,
            });
            setLoading(false);
            Swal.fire("Success", "Your booking has been cancelled", "success").then(() => {
                // Stay on Bookings tab even after reload
                localStorage.setItem("profile-tab", "2");
                window.location.reload();
            });
        } catch (error) {
            setLoading(false);
            Swal.fire("Error", "Something went wrong", "error");
        }
    }

    return (
        <div className="row" style={{ marginTop: "20px" }}>
            <div className="col-md-6">
                {loading && <Loader />}
                {error && <Error />}
                {bookings.map((booking) => (
                    <div
                        className="bs"
                        key={booking._id}
                        style={{
                            marginBottom: "20px",
                            padding: "20px",
                            border: "1px solid #f0f0f0",
                            borderRadius: "5px",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                            fontFamily: "'Segoe UI', sans-serif",
                        }}
                    >
                        <h5 style={{ fontWeight: "600", marginBottom: "15px" }}>{booking.room}</h5>

                        <p style={{ fontSize: "15px", marginBottom: "6px", color: "#333" }}>
                            <b style={{ fontWeight: 500 }}>Booking ID:</b> {booking._id}
                        </p>
                        <p style={{ fontSize: "15px", marginBottom: "6px", color: "#333" }}>
                            <b style={{ fontWeight: 500 }}>Transaction ID:</b> {booking.transactionId}

                        </p>
                        <p style={{ fontSize: "15px", marginBottom: "6px", color: "#333" }}>
                            <b style={{ fontWeight: 500 }}>Check-In:</b> {moment(booking.fromdate).format("MMM DD YYYY")}
                        </p>
                        <p style={{ fontSize: "15px", marginBottom: "6px", color: "#333" }}>
                            <b style={{ fontWeight: 500 }}>Check-Out:</b> {moment(booking.todate).format("MMM DD YYYY")}
                        </p>
                        <p style={{ fontSize: "15px", marginBottom: "6px", color: "#333" }}>
                            <b style={{ fontWeight: 500 }}>Total Amount:</b> ₹{booking.totalamount}
                        </p>
                        <p style={{ fontSize: "15px", marginBottom: "10px", color: "#333" }}>
                            <b style={{ fontWeight: 500 }}>Status:</b>{" "}
                            {booking.status === "booked" ? (
                                <Tag color="green">CONFIRMED</Tag>
                            ) : (
                                <Tag color="red">CANCELLED</Tag>
                            )}
                        </p>

                        {booking.status === "booked" && (
                            <div className="text-end">
                                <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                        cancelBooking(booking._id, booking.roomid)
                                    }
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
