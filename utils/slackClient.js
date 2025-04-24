const axios = require('axios');

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const CHANNEL = process.env.ATTENDANCE_CHANNEL || '#attendance';

exports.postToChannel = async (text) => {
    await axios.post('https://slack.com/api/chat.postMessage', {
        channel: CHANNEL,
        text,
    }, {
        headers: {
            Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });

    return 'Notified in channel!';
};
