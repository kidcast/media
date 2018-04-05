'use strict';

function getAuth(req, res) {
  let authHeader = req.get('Authorization');

  if(!authHeader) {
    res.sendStatus(401, 'Please provide a username/password');
    return;
  }
    
  let payload = authHeader.split('Basic ')[1];
  console.log('authheader', authHeader);
  let decoded = Buffer.from(payload, 'base64').toString();
  return decoded.split(':');
}

module.exports = getAuth;