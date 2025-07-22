import React, { useEffect, useState } from "react";
import { Tabs, message } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";

const { TabPane } = Tabs;

function Adminscreen() {
    return (
        <div className="mt-3 ml-3 mr-3 bs">
            <h2 className="text-center" style={{ fontSize: "30px" }}>
                <b>Admin Panel</b>
            </h2>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Bookings" key="1">
                    <Bookings />
                </TabPane>
                <TabPane tab="Rooms" key="2">
                    <Rooms />
                </TabPane>
                <TabPane tab="Add Room" key="3">
                    <Addroom />
                </TabPane>
                <TabPane tab="Users" key="4">
                    <Users />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Adminscreen;

// ✅ BOOKINGS
export function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        async function fetchBookings() {
            try {
                const result = await axios.get("/api/bookings/getallbookings");
                setBookings(result.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(err);
                setLoading(false);
            }
        }

        fetchBookings();
    }, []);

    return (
        <div className="row">
            <div className="col-md-12">
                <h1>Bookings</h1>
                {loading && <Loader />}
                {error && <Error />}
                <table className="table table-bordered table-dark">
                    <thead>
                        <tr>
                            <th>Booking Id</th>
                            <th>User Id</th>
                            <th>Room</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking._id}>
                                <td>{booking._id}</td>
                                <td>{booking.userid}</td>
                                <td>{booking.room}</td>
                                <td>{booking.fromdate}</td>
                                <td>{booking.todate}</td>
                                <td>{booking.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ✅ ROOMS
export function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        async function fetchRooms() {
            try {
                const result = await axios.get("/api/rooms/getallrooms");
                setRooms(result.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(err);
                setLoading(false);
            }
        }

        fetchRooms();
    }, []);

    return (
        <div className="row">
            <div className="col-md-12">
                <h1>Rooms</h1>
                {loading && <Loader />}
                {error && <Error />}
                <table className="table table-bordered table-dark">
                    <thead>
                        <tr>
                            <th>Room ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Rent per Day</th>
                            <th>Max Count</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room._id}>
                                <td>{room._id}</td>
                                <td>{room.name}</td>
                                <td>{room.type}</td>
                                <td>{room.rentperday}</td>
                                <td>{room.maxcount}</td>
                                <td>{room.phonenumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ✅ USERS
export function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const result = await axios.get("/api/users/getallusers");
                setUsers(result.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(err);
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    return (
        <div className="row">
            <div className="col-md-12">
                <h1>Users</h1>
                {loading && <Loader />}
                {error && <Error />}
                <table className="table table-bordered table-dark">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ✅ ADD ROOM
export function Addroom() {
    const [name, setname] = useState("");
    const [rentperday, setrentperday] = useState("");
    const [maxcount, setmaxcount] = useState("");
    const [description, setdescription] = useState("");
    const [phonenumber, setphonenumber] = useState("");
    const [type, settype] = useState("");
    const [imageurl1, setimageurl1] = useState("");
    const [imageurl2, setimageurl2] = useState("");
    const [imageurl3, setimageurl3] = useState("");

    async function addRoom() {
        const room = {
            name,
            rentperday,
            maxcount,
            description,
            phonenumber,
            type,
            imageurls: [imageurl1, imageurl2, imageurl3],
        };

        console.log(room); // for debug

        try {
            await axios.post("/api/rooms/addroom", room);
            Swal.fire("Congrats", "Your New Room Added Successfully", "success");

            // Clear form
            setname("");
            setrentperday("");
            setmaxcount("");
            setdescription("");
            setphonenumber("");
            settype("");
            setimageurl1("");
            setimageurl2("");
            setimageurl3("");
        } catch (error) {
            console.log(error);
            message.error("Something went wrong, please try again later...");
        }
    }

    return (
        <div className="row">
            <div className="col-md-5">
                <input type="text" className="form-control" placeholder="room name" value={name} onChange={(e) => setname(e.target.value)} />
                <input type="text" className="form-control" placeholder="rent per day" value={rentperday} onChange={(e) => setrentperday(e.target.value)} />
                <input type="text" className="form-control" placeholder="max count" value={maxcount} onChange={(e) => setmaxcount(e.target.value)} />
                <input type="text" className="form-control" placeholder="description" value={description} onChange={(e) => setdescription(e.target.value)} />
                <input type="text" className="form-control" placeholder="phone number" value={phonenumber} onChange={(e) => setphonenumber(e.target.value)} />
            </div>

            <div className="col-md-5">
                <input type="text" className="form-control" placeholder="type" value={type} onChange={(e) => settype(e.target.value)} />
                <input type="text" className="form-control" placeholder="Image URL 1" value={imageurl1} onChange={(e) => setimageurl1(e.target.value)} />
                <input type="text" className="form-control" placeholder="Image URL 2" value={imageurl2} onChange={(e) => setimageurl2(e.target.value)} />
                <input type="text" className="form-control" placeholder="Image URL 3" value={imageurl3} onChange={(e) => setimageurl3(e.target.value)} />
                <div className="text-right">
                    <button className="btn btn-primary mt-3" onClick={addRoom}>Add Room</button>
                </div>
            </div>
        </div>
    );
}
