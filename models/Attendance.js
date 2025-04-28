const mongoose = require('mongoose');

const WorkSessionSchema = new mongoose.Schema({
    start: { type: Date, required: true },
    end: { type: Date } // null if not ended yet
});

const BreakSchema = new mongoose.Schema({
    type: { type: String, enum: ['lunch', 'short'], required: true },
    start: { type: Date, required: true },
    end: { type: Date } // null if ongoing
});

const AttendanceSchema = new mongoose.Schema({
    user: { type: String, required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    workSessions: [WorkSessionSchema],
    breaks: [BreakSchema]
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
