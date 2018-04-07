'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

function processBearer(req, res, next) {
  console.log('bearer middle 7');
  let authHeader = req.get('Authorization');
  var token = authHeader.split('Bearer ')[1];
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    console.log('verified token', decoded);
    if (err) {
      console.log('verified token err', err);
      res.status(401).send('invalid token');
    }
    User.findOne({_id: decoded.userId })
      .then(user => {
        console.log('found user');
        req.user = user;
        next();
      })
      .catch(err => res.send(err.message));
  });
}

module.exports = processBearer;