const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/Task1');

const db = mongoose.connection;

db.on('connected', () => {
    console.log("db connected");
});

db.on('error', (err) => {
    console.error("db connection error:", err);
});

module.exports = db;
