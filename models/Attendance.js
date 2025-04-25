const mongoose = require('mongoose');

const BreakSchema = new mongoose.Schema({
    type: { type: String, enum: ['lunch', 'short'], required: true },
    start: Date,
    end: Date
});

const AttendanceSchema = new mongoose.Schema({
    user: String,
    date: String,
    checkIn: Date,
    checkOut: Date,
    breaks: [BreakSchema]
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
