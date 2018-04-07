'use strict';

const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user.js');
const getAuth = require('../library/authorization.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', express.json(), (req, res) => {
  User.create(req.body)
    .then((user) => {
      console.error('created user', user);
      res.status(200);
      res.send(user);
    })
    .catch((err) => {
      console.error('user not created', err);
      res.sendStatus(400);
    });
});

router.get('/signin', (req, res) => {
  let [username, password] = getAuth(req, res);
  User.findOne({
    username
  }).then(user => {
    user.checkPassword(password).then(result => {
      if (result) {
        let data = {userId: user._id};
        let token = jwt.sign(data, process.env.SECRET, (err, newToken) => {
          res.status(200);
          res.send({
            signedIn: true,
            token: newToken,
          });
        });
      } else {
        res.status(401).send('please re-enter password');
      }
    });
  });
});

module.exports = router;