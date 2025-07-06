const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// DB Config
const dbConfig = require("./db");

// Routes
const roomsRoute = require("./routes/roomsRoute");
const usersRoute = require("./routes/usersRoute");
const bookingsRoute = require("./routes/bookingsRoute");

app.use(cors());
app.use(express.json());

// Serve static images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingsRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
