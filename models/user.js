'use strict';

const mongoose = require('mongoose');
const Media = require('./media.js');

let userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: String,
});
const User = mongoose.model('User', userSchema);

module.exports = User;