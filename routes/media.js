'use strict';

require('dotenv').config();

const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const express = require('express');
const path = require('path');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const mongoose = require('mongoose');


const Media = require('../models/media.js');

const bearerMiddlewear = require('../library/bearer-middleware');

const DATABASE_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/kidcast';
mongoose.connect(DATABASE_URL);
const router = express.Router();

router.get('/', (req, res) => {
  if (req.query.id) {
    Media.findOne({ _id: req.query.id }, (err, media) => {
      if (media.public) {
        res.send(media);
      } else {
        res.status(400);
        res.send('Bad Request. Media Request is Pending Approval');
      }
    });
  } else {
    Media.find().then(media => {
      let publicMedia = media.filter(mediaItem => {
        if (mediaItem.public) {
          return mediaItem;
        }
      });
      res.send(publicMedia);
    });
  }
});

router.post('/', bearerMiddlewear, upload.single('media'), function (req, res) {
  let ext = path.extname(req.file.originalname).toLowerCase();
  if (ext === '.mp4' || ext === '.mov' || ext === 'm4v') {
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
        userId: req.body.userId,
        category: req.body.category,
        type: req.body.type,
        public: false
      });
      media.save()
        .then(media => {
          res.send(media);
        });
    });
  } else {
    res.status(404);
    res.send('Bad Request. Please Only Upload mp4, mov, or m4v files');
  }
});

router.put('/', bearerMiddlewear, function (req, res) {
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

router.delete('/', bearerMiddlewear, function (req, res) {
  Media.remove({_id: req.query.id}, (err, media) => {
    res.status(204);
    res.send('Deleted Successfully');
  });
});


module.exports = router;