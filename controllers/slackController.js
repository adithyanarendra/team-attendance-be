const attendanceService = require('../services/attendanceService');

exports.handleSlackCommand = async (req, res) => {
    const { command, user_name, text } = req.body;

    try {
        let responseText = await attendanceService.processCommand(command, user_name, text);
        return res.status(200).send(responseText || '👍');
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Something went wrong.');
    }
};
