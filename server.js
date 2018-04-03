'use strict';

require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded());

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

app.listen(process.env.PORT, () => {
    console.log(`listening in at http://localhost:${process.env.PORT}`);
});