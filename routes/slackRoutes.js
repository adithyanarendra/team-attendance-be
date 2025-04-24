const express = require('express');
const router = express.Router();
const slackController = require('../controllers/slackController');

router.post('/events', slackController.handleSlackCommand);

module.exports = router;
