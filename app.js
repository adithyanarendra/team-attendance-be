const express = require('express');
const autoCheckout = require('./cron/autoCheckout');
const bodyParser = require('body-parser');
require('./config/dotenv');

const slackRoutes = require('./routes/slackRoutes');
const healthRoute = require('./routes/health');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/slack', slackRoutes);
app.use('/health', healthRoute);

autoCheckout();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
