'use strict';

require('dotenv').config();

const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
const SERVER_URL = 'http://localhost:' + PORT;
const SIGNUP_URL = SERVER_URL + '/api/signup';
const SIGNIN_URL = SERVER_URL + '/api/signin';

function getUserParams() {
  return {
    username: `bill${Math.random()}`,
    email: `bill${Math.random()}@microsoft.com`,
    password: 'windows95'
  };
};

const TestUser = require('../models/user.js');
describe('User model test',() => {
  it('Test that a user has a username property', done => {
    let tempUser = new TestUser(getUserParams());
    expect(typeof tempUser.username).toEqual('string');
    expect(typeof tempUser.email).toEqual('string');
    expect(typeof tempUser.password).toEqual('string');
    done();
  });
});