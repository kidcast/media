'use strict';

const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user.js');
const getAuth = require('../library/authorization.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', express.json(), (req, res) => {
  console.log('body', req.body);
  User.create(req.body)
    .then((user) => {
      console.log('created user', user);
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log('user not created', err);
      res.sendStatus(400);
    });
});

router.get('/signin', (req, res) => {
  let [username, password] = getAuth(req, res);
  User.findOne({
    username
  }).then(user => {
    console.log('get request user password check', user);
    user.checkPassword(password).then(result => {
      if (result) {
        console.log('user password check', result);
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