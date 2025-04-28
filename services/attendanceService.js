const slackClient = require('../utils/slackClient');
const Attendance = require('../models/Attendance');
const moment = require('moment-timezone');

exports.processCommand = async (command, user, text) => {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();

    let record = await Attendance.findOne({ user, date: today });

    if (!record) {
        record = new Attendance({ user, date: today, workSessions: [], breaks: [] });
    }

    switch (command) {
        case '/checkin':
            {
                // If currently on a break, end the break
                const lastBreak = record.breaks[record.breaks.length - 1];
                if (lastBreak && !lastBreak.end) {
                    lastBreak.end = now;
                }

                // Check if already working
                const lastSession = record.workSessions[record.workSessions.length - 1];
                if (lastSession && !lastSession.end) {
                    return `${user}, you are already checked in since ${moment(lastSession.start).tz('Asia/Kolkata').format('HH:mm')} 🕒`;
                }

                // Start new work session
                record.workSessions.push({ start: now, end: null });
                await record.save();

                return slackClient.postToChannel(`${user} checked in ✅ at ${moment(now).tz('Asia/Kolkata').format('HH:mm')}`);
            }
        case '/checkout':
            {
                const lastSession = record.workSessions[record.workSessions.length - 1];
                if (!lastSession || lastSession.end) {
                    return `${user}, you are not currently checked in.`;
                }

                lastSession.end = now;
                await record.save();

                // Calculate total work time
                const totalWorkMinutes = record.workSessions.reduce((acc, session) => {
                    if (session.start && session.end) {
                        return acc + moment(session.end).diff(moment(session.start), 'minutes');
                    }
                    return acc;
                }, 0);

                // Calculate total break time
                const totalBreakMinutes = record.breaks.reduce((acc, b) => {
                    if (b.start && b.end) {
                        return acc + moment(b.end).diff(moment(b.start), 'minutes');
                    }
                    return acc;
                }, 0);

                const workHours = Math.floor(totalWorkMinutes / 60);
                const workMinutes = totalWorkMinutes % 60;
                const breakHours = Math.floor(totalBreakMinutes / 60);
                const breakMinutes = totalBreakMinutes % 60;

                return slackClient.postToChannel(`${user} checked out 📴 at ${moment(now).tz('Asia/Kolkata').format('HH:mm')}.
Worked ${workHours}h ${workMinutes}m. Break Time ${breakHours}h ${breakMinutes}m`);
            }
        case '/break':
            {
                const validTypes = ['lunch', 'short'];
                if (!validTypes.includes(text)) return `Unknown break type: "${text}"`;

                // Must be working to take a break
                const lastSession = record.workSessions[record.workSessions.length - 1];
                if (!lastSession || lastSession.end) {
                    return `${user}, you must be working (checked in) to take a break.`;
                }

                // End the current work session
                lastSession.end = now;

                // Start a new break
                record.breaks.push({ type: text, start: now, end: null });
                await record.save();

                return slackClient.postToChannel(`${user} is on a ${text} break ${text === 'lunch' ? '🍱' : '☕'}`);
            }

        default:
            return `Unknown command: ${command}`;
    }
};
