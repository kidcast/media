'use strict';

require('dotenv').config();

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.json());

const mediaAPI = require('./routes/media.js');

app.use('/api/media', mediaAPI);

app.listen(process.env.PORT, () => {
    console.log(`listening in at http://localhost:${process.env.PORT}`);
});