/* Adapted by JB Tellez from https://gist.github.com/frapfi/2ae352d0f23d10bbb178463f0339e2f6 */

'use strict';

var mongoose = require('mongoose');

/**
 * Close Mongoose connection, passing through ananonymous
 * function to run when closed
 * @param msg
 * @param callback
 */
const gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
// For nodemon restarts
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For (node) app termination
process.on('SIGINT', function () {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});