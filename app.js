const express = require('express');
const bodyParser = require('body-parser');
require('./config/dotenv');

const slackRoutes = require('./routes/slackRoutes');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/slack', slackRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
