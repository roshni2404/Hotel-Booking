const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/SheyRooms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

connection.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});


module.exports = mongoose;











