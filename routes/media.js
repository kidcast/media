'use strict';

const fs = require('fs');

const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const express = require('express');

const multer = require('multer');

const upload = multer({ dest: 'uploads/'});

const path = require('path');

const Media = require('../model/media.js');

const mediaStorage = require('../lib/media.js');

const router = express.Router();

module.exports = router;