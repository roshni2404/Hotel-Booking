// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Room from "../components/Room";
// import Loader from "../components/Loader";
// import Error from "../components/Error";
// import moment from "moment";
// import { DatePicker } from "antd";
// import "antd/dist/antd.css";

// const { RangePicker } = DatePicker;

// function Homescreen() {
//     const [rooms, setRooms] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);
//     const [fromdate, setFromdate] = useState();
//     const [todate, setTodate] = useState();

//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 setLoading(true);
//                 const data = (await axios.get("/api/rooms/getallrooms")).data;
//                 setRooms(data);
//                 setLoading(false);
//             } catch (error) {
//                 console.log(error);
//                 setError(true);
//                 setLoading(false);
//             }
//         }
//         fetchData();
//     }, []);

//     function filterByDate(dates) {
//         if (dates) {
//             setFromdate(moment(dates[0]).format("DD-MM-YYYY"));
//             setTodate(moment(dates[1]).format("DD-MM-YYYY"));
//         } else {
//             setFromdate(null);
//             setTodate(null);
//         }
//     }

//     return (
//         <div style={{ padding: "20px" }}>
//             <div className="homescreennav" style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
//                 <RangePicker format="DD-MM-YYYY" onChange={filterByDate} className="datepicker" />
//                 <input
//                     type="text"
//                     placeholder="Search rooms"
//                     className="form-control"
//                     style={{ flex: 1, minWidth: "200px" }}
//                 />
//                 <select className="form-control" style={{ minWidth: "150px" }}>
//                     <option value="all">All</option>
//                     <option value="delux">Delux</option>
//                     <option value="non-delux">Non-Delux</option>
//                 </select>
//             </div>

//             {loading ? (
//                 <Loader />
//             ) : error ? (
//                 <Error />
//             ) : (
//                 <div className="homescreengrid" style={{ display: "grid", gap: "20px" }}>
//                     {rooms.map((room) => (
//                         <Room room={room} fromdate={fromdate} todate={todate} key={room._id} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Homescreen;









import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { DatePicker } from "antd";
import "antd/dist/antd.css";

const { RangePicker } = DatePicker;

function Homescreen() {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [fromdate, setFromdate] = useState();
    const [todate, setTodate] = useState();
    const [type, setType] = useState("all");

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = (await axios.get("/api/rooms/getallrooms")).data;
                setRooms(data);
                setFilteredRooms(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(true);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    function filterByDate(dates) {
        if (dates) {
            setFromdate(moment(dates[0]).format("DD-MM-YYYY"));
            setTodate(moment(dates[1]).format("DD-MM-YYYY"));
        } else {
            setFromdate(null);
            setTodate(null);
        }
    }

    function filterByType(selectedType) {
        setType(selectedType);

        if (selectedType === "all") {
            setFilteredRooms(rooms);
        } else {
            const temp = rooms.filter(
                (room) => room.type.toLowerCase() === selectedType
            );
            setFilteredRooms(temp);
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            <div
                className="homescreennav"
                style={{ display: "flex", gap: "15px", marginBottom: "20px" }}
            >
                <RangePicker
                    format="DD-MM-YYYY"
                    onChange={filterByDate}
                    className="datepicker"
                />

                <input
                    type="text"
                    placeholder="Search rooms"
                    className="form-control"
                    style={{ flex: 1, minWidth: "200px" }}
                />

                <select
                    className="form-control"
                    style={{ minWidth: "150px" }}
                    value={type}
                    onChange={(e) => filterByType(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="delux">Delux</option>
                    <option value="non-delux">Non-Delux</option>
                </select>
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <Error />
            ) : (
                <div
                    className="homescreengrid"
                    style={{ display: "grid", gap: "20px" }}
                >
                    {filteredRooms.map((room) => (
                        <Room room={room} fromdate={fromdate} todate={todate} key={room._id} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Homescreen;
