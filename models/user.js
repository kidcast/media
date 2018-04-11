'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Media = require('./media.js');
const jwt = require('jsonwebtoken');

let userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { 
    type: String, 
    required: true 
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  }
});

userSchema.methods.checkPassword = function (attempt) {
  return bcrypt.compare(attempt, this.password);
};

userSchema.pre('save', function (next) {
  if (this.isNew) {
    bcrypt.hash(this.password, 10).then(hash => {
      this.password = hash;
      next();
    }).catch(err => console.error(err));
  } else {
    next();
  };
});
const User = mongoose.model('User', userSchema);

module.exports = User;