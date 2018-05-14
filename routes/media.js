'use strict';

require('dotenv').config();

const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const express = require('express');
const path = require('path');

const multer = require('multer');
const upload = multer({
  dest: 'uploads/'
});
const mongoose = require('mongoose');
const mongone = require('../library/mongone.js');

const Media = require('../models/media.js');

const bearerMiddlewear = require('../library/bearer-middleware');

const DATABASE_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/kidcast';

mongoose.connect(DATABASE_URL);
const router = express.Router();

router.get('/', (req, res) => {
  if (req.query.id) {
    Media.findOne({
      _id: req.query.id
    }, (err, media) => {
      if (media.public) {
        res.send(media);
      } else {
        res.status(400);
        res.send('Bad Request. Media Request is Pending Approval');
      }
    });
  } else {
    let params = {};
    if (req.query.category) {
      params = {category: req.query.category};
    } else if (req.query.userId) {
      params = {userId: req.query.userId};
    };
    Media.find(params, (err, media) => {
      let publicMedia = media.filter(mediaItem => {
        if (mediaItem.public) {
          return mediaItem;
        };
      });
      res.status(200);
      res.send(publicMedia);
    }).catch(err => {
      console.error(err);
    });
  }
});

router.post('/', bearerMiddlewear, upload.single('media'), function (req, res) {
  let ext = path.extname(req.file.originalname).toLowerCase();
  if (req.user._id === undefined || req.user._id === null) {
    res.status(400);
    res.send('Invalid Credentials');
  }
  if (req.body.category === 'fun' || req.body.category === 'education') {
    if (ext === '.mp4' || ext === '.mov' || ext === '.m4v') {
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
          userId: req.user._id,
          category: req.body.category,
          type: req.body.type,
          public: false
        });
        media.save()
          .then(media => {
            res.status(200);
            res.send(media);
          });
      });
    } else {
      res.status(400);
      res.send('Bad Request. Please Only Upload mp4, mov, or m4v files');
    }
  } else {
    res.status(400);
    res.send('Bad Request. Available categories: fun, education');
  }
});

router.put('/', bearerMiddlewear, function (req, res) {
  if (req.body.category === 'fun' || req.body.category === 'education') {
    Media.findOne({
      _id: req.query.id
    })
      .then(media => {
        if (req.user._id.toString() === media.userId.toString() || req.user.isAdmin) {
          Media.findOneAndUpdate({
            _id: req.query.id
          }, {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category
          }, (err, media) => {
            Media.findOne({
              _id: req.query.id
            }).then(media => {
              res.status(200);
              res.send(media);
            }).catch((err) => {
              console.error(err);
            });
          });
        } else {
          res.status(403);
          res.send('sorry, you do not have access to update this content');
        }
      }).catch((err) => {
        res.status(400);
        res.send('bad request');
      });
  } else {
    res.status(400);
    res.send('Bad Request. Available categories: fun, education');
  }
});

router.delete('/', bearerMiddlewear, function (req, res) {
  Media.findOne({
    _id: req.query.id
  })
    .then(media => {
      if (req.user._id.toString() === media.userId.toString() | req.user.isAdmin) {
        Media.remove({
          _id: req.query.id
        }, (err, media) => {
          res.status(204);
          res.send();
        }).catch(err => {
          res.status(400);
          res.send('Unable to remove resource');
        });
      } else {
        res.status(403);
        res.send('sorry, you do not have access to delete this content');
      }
    })
    .catch(err => {
      res.status(400);
      res.send('Cannot find resource');
    });
});


module.exports = router;