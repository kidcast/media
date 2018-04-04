'use strict';

const express = require('express');
const mongoose = require('mongoose');
const User = require('../model/user.js');
const getAuth = require('../lib/authorization.js');
// const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', express.json(), (req, res) => {
    console.log('body', req.body);
    User.create(req.body)
    .then((user) => {
        console.log('created user', user);
        res.status(200).send(user);
    })
    .catch(() => res.sendStatus(400))
});




module.exports = router;