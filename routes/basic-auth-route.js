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
    .catch(() => res.sendStatus(400));
});

router.get('/singin', (req, res) => {
  let [username, password] = getAuth(req, res);
  User.findOne({
    username
  }).then(user => {
    user.checkPassword(password).then(result => {
      if (result) {
        let data = {
          userId: user_id
        };
        let token = jws.sign(data, process.env.SECRET);
      } else {
        res.status(401).send('please re-enter password');
      }
    });
  });
});

module.exports = router;