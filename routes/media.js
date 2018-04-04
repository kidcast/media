'use strict';

require('dotenv').config();

const fs = require('fs');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const express = require('express');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const path = require('path');

const Media = require('../models/media.js');


const mongoose = require('mongoose');

const Model = require('../models/media.js');

const DATABASE_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/kidcast';

mongoose.connect(DATABASE_URL);

const router = express.Router();

router.get('/', (req, res) => {
  if (req.query.id) {
    Media.findOne({ _id: req.query.id }, (err, media) => {
      res.send(media);
    });
  } else {
    Media.find().then(media => {
      res.send(media);
    });
  }
});

router.post('/', upload.single('media'), function (req, res) {
  console.log('in route. req.body', req.body);
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

router.put('/', function (req, res) {
  Media.findOneAndUpdate({_id: req.query.id}, {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    type: req.body.type
  }, (err, media) => {
    Media.findOne({_id: req.query.id}).then(media => {
      res.send(media);
    });
  });
});

router.delete('/', function (req, res) {
  Media.remove({_id: req.query.id}, (err, media) => {
    res.status(204);
    res.send('Deleted Successfully');
  });
});


module.exports = router;