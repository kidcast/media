'use strict';

const mongoose = require('mongoose');
const User = require('./user.js');

let mediaSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: String,
  mediaUrl: String, 
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  category: String,
  type: String,
  public: {type: Boolean, default: false}
});
const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;