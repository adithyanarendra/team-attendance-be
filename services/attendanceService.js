const slackClient = require('../utils/slackClient');
const Attendance = require('../models/Attendance');
const moment = require('moment-timezone');

exports.processCommand = async (command, user, text) => {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();

    let record = await Attendance.findOne({ user, date: today });

    // TO-DO use this for full time and date {moment(now).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')}
    switch (command) {
        case '/checkin':
            if (record?.checkIn) {
                return `${user}, you already checked in at ${moment(record.checkIn).tz('Asia/Kolkata').format('HH:mm')} 🕒`;
            }
            if (!record) {
                record = new Attendance({ user, date: today });
            }
            record.checkIn = now;
            await record.save();
            return slackClient.postToChannel(`${user} checked in ✅ at ${moment(now).tz('Asia/Kolkata').format('HH:mm')}`);

        case '/checkout':
            if (!record?.checkIn) {
                return `${user}, you haven’t checked in today.`;
            }
            if (record.checkOut) {
                return `${user}, you already checked out at ${moment(record.checkOut).tz('Asia/Kolkata').format('HH:mm')}`;
            }
            record.checkOut = now;
            await record.save();

            const duration = moment.duration(moment(now).diff(moment(record.checkIn)));
            const hours = duration.hours();
            const minutes = duration.minutes();
            return slackClient.postToChannel(`${user} checked out 📴 at ${moment(now).tz('Asia/Kolkata').format('HH:mm')}. Worked ${hours}h ${minutes}m`);

        case '/break':
            if (!record?.checkIn) return `${user}, you must check in before taking a break.`;

            const validTypes = ['lunch', 'short'];
            if (!validTypes.includes(text)) return `Unknown break type: "${text}"`;

            const currentBreak = {
                type: text,
                start: now,
                end: now
            };

            record.breaks.push(currentBreak);
            await record.save();
            return slackClient.postToChannel(`${user} is on a ${text} break ${text === 'lunch' ? '🍱' : '☕'}`);

        default:
            return `Unknown command: ${command}`;
    }
};
