'use strict';

require('dotenv').config();

const fs = require('fs');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const express = require('express');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const path = require('path');

const Media = require('../model/media.js');
const mediaStorage = require('../lib/media.js');

const mongoose = require('mongoose');

const Model = require('../model/media.js');

const DATABASE_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/kidcast';

mongoose.connect(DATABASE_URL);

const router = express.Router();

router.post('/', upload.single('media'), function (req, res) {
  let ext = path.extname(req.file.originalname);
  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: req.file.originalname,
    Body: fs.createReadStream(req.file.path)
  };
  s3.upload(params, (err, s3Data) => {
    let media = new Media({
      title: req.body.title,
      description: req.body.description,
      mediaUrl: s3Data.Location,
      // userId: req.body.userId,
      category: req.body.category,
      type: req.body.type,
      public: false
    });
    media.save()
      .then(media => {
        res.send(media);
      });
  });
});

module.exports = router;