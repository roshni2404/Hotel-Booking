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

// Middlewares
app.use(cors());
app.use(express.json());

// Static Folder for Images (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// API Routes
app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingsRoute);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
