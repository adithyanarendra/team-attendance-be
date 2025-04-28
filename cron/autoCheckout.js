const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const moment = require('moment-timezone');

const autoCheckout = () => {
    cron.schedule('59 23 * * *', async () => {
        console.log('Running auto-checkout task at 23:59');

        const today = new Date().toISOString().slice(0, 10);
        const now = new Date();

        const records = await Attendance.find({ date: today });

        for (let record of records) {
            const lastSession = record.workSessions[record.workSessions.length - 1];
            if (lastSession && !lastSession.end) {
                lastSession.end = now;
                await record.save();
                console.log(`Auto-checked out ${record.user} at ${moment(now).tz('Asia/Kolkata').format('HH:mm')}`);
            }
        }
    });
};

module.exports = autoCheckout;
