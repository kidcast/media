'use strict';

require('dotenv').config();

const mongoose = require('mongoose');

const Model = require('../model/media.js');

const DATABASE_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/kidcast';

mongoose.connect(DATABASE_URL);

