'use strict';

require('dotenv').config();

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const mediaAPI = require('./routes/media.js');

app.use('/api/media', mediaAPI);

const basicAuth = require('./routers/basic-auth-route.js');
app.use('/', basicAuth);

app.listen(process.env.PORT, () => {
    console.log(`listening in at http://localhost:${process.env.PORT}`);
});