const slackClient = require('../utils/slackClient');

exports.processCommand = async (command, user, text) => {
    switch (command) {
        case '/checkin':
            return slackClient.postToChannel(`${user} checked in ✅`);
        case '/checkout':
            return slackClient.postToChannel(`${user} checked out 📴`);
        case '/break':
            if (text === 'lunch') return slackClient.postToChannel(`${user} is on a lunch break 🍱`);
            if (text === 'short') return slackClient.postToChannel(`${user} is taking a short break ☕`);
            return `Unknown break type: "${text}"`;
        default:
            return `Unknown command: ${command}`;
    }
};
