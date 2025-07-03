const express = require('express');
const mongoose = require('mongoose');
const logger = require('./middleware/logger');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(logger);

mongoose.connect(process.env.MONGO_URI);

app.use('/api', require('./routes/shorten'));
app.use('/', require('./routes/redirect'));
app.use('/api', require('./routes/stats'));

app.listen(3000, () => console.log('Server started'));
