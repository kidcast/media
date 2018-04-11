'use strict';

require('dotenv').config();

const express = require('express');

const app = express();
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const mediaAPI = require('./routes/media.js');
const basicAuth = require('./routes/basic-auth-route.js');

app.use('/api/media', mediaAPI);
app.use('/api', basicAuth);

// Server Controls
const server = module.exports = {};
server.start = () => {
  return new Promise((resolve, reject) => {
    if(server.isOn) return reject(new Error('Server Error. Server already running.'));
    server.http = app.listen(process.env.PORT, () => {
      console.info(`Listening on ${process.env.PORT}`);
      server.isOn = true;
      return resolve(server);
    });
  });
};
server.stop = () => {
  return new Promise((resolve, reject) => {
    if(!server.isOn) return reject(new Error('Server Error. Server already stopped.'));
    server.http.close(() => {
      server.isOn = false;
      return resolve();
    });
  });
};