'use strict';
require('dotenv').config();

const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
const SERVER_URL = 'http://localhost:' + PORT;
const SIGNUP_URL = SERVER_URL + '/api/signup';
const SIGNIN_URL = SERVER_URL + '/api/signin';

const TestUser = require('../models/user.js');
describe('User model test',() => {
  it('Test that a user has a username property', done => {
    let tempUser = new TestUser(getUserParams());
    expect(tempUser.username).toBe('bill');
    expect(tempUser.email).toBe('bill@microsoft.com');
    expect(tempUser.password).toBe('windows95');
    done();
  });
});

describe('Media Sunny Day Requests', () => {

  it('should return 200 for uploading a photo and include proper AWS url', done => {
    //sign Up
    let signUpUrl = `http://localhost:${process.env.PORT}/api/signup`;
    let signUpBody = {
      username: `randomUserTest${Math.random()}`,
      password: `randomPasswordTest${Math.random()}`,
      email: `${Math.random()}@email.com`
    };
    superagent.post(signUpUrl)
      .auth(signUpBody.username, signUpBody.password)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(signUpBody))
      .end((err, res) => {
        console.log('res in signup', res.body);
        //Sign In
        let signInUrl = `http://localhost:${process.env.PORT}/api/signin`;

        superagent.get(signInUrl)
          .auth(signUpBody.username, signUpBody.password)
          .end((err, res) => {
            console.log('sign in res', res.body);
            let token = res.body.token;
            let mediaLocation = './uploads/kidMusic.png';
            let newMedia = {
              title: `Test Title: ${Math.random()}`,
              description: `Test Description: ${Math.random()}`,
              category: `Test Category: ${Math.random()}`,
              type: `Test Type: ${Math.random()}`,
              public: false
            };
            // post new media
            let uploadUrl = `http://localhost:${process.env.PORT}/api/media`;
            superagent.post(uploadUrl)
              .field('title', newMedia.title)
              .set('Authorization', 'Bearer ' + token)
              .attach('media', mediaLocation)
              .end((err, res) => {
                console.log('Error', err);
                console.log('res.body', res.body);
                let amazonUrl = process.env.AWS_BUCKET + '.s3.amazonaws.com';
                let isAmazonUrl = res.body.mediaUrl.includes(amazonUrl);
                expect(isAmazonUrl).toBe(true);
                expect(res.status).toBe(200);
                done();
              });
          });
      });
  });

});
//make sure that test are testing data lines and functions vs response's
//
function getUserParams() {
  return {
    username: 'bill',
    email: 'bill@microsoft.com',
    password: 'windows95'
  };
};

describe('/api/signup', () => {
  it('should return status 400 if missing username', (done) => {
    let params = getUserParams();
    delete params['username'];

    superagent.post(SIGNUP_URL)
      .set('Content-Type', 'application/json')
      .send(params)
      .catch(err => {
        expect(err.status).toEqual(400);
        done();
      });
  });

  it('should return status 400 if missing email', (done) => {
    let params = getUserParams();
    delete params['email'];

    superagent.post(SIGNUP_URL)
      .set('Content-Type', 'application/json')
      .send(params)
      .catch(err => {
        expect(err.status).toEqual(400);
        done();
      });
  });

  it('should return status 400 if missing password', (done) => {
    let params = getUserParams();
    delete params['password'];

    superagent.post(SIGNUP_URL)
      .set('Content-Type', 'application/json')
      .send(params)
      .catch(err => {
        expect(err.status).toEqual(400);
        done();
      });
  });

  it('should return status 200 with successful request', (done) => {
    let params = getUserParams();

    superagent.post(SIGNUP_URL)
      .set('Content-Type', 'application/json')
      .send(params)
      .then(res => {
        expect(res.status).toEqual(200);
        done();
      });
  });
});

describe('/api/signin', () => {
  it('should return 401 unauthorized if password is incorrect', (done) => {
    let params = getUserParams();

    superagent.post(SIGNUP_URL)
      .set('Content-Type', 'application/json')
      .send(params)
      .then(res => {
        expect(res.status).toEqual(200);

        // intentionally set the password as a wrong password
        let payload = params['username'] + ':' + 'wrongpassword';
        let encoded = btoa(payload);

        return superagent.get(SIGNIN_URL)
          .set('Authorization', 'Basic ' + encoded);
      })
      .catch(err => {
        expect(err.status).toEqual(401);
        done();
      });
  });

  it('should return 200 if username and password are', (done) => {
    let params = getUserParams();

    superagent.post(SIGNUP_URL)
      .set('Content-Type', 'application/json')
      .send(params)
      .then(res => {
        expect(res.status).toEqual(200);

        let payload = params['username'] + ':' + params['password'];
        let encoded = btoa(payload);

        return superagent.get(SIGNIN_URL)
          .set('Authorization', 'Basic ' + encoded);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        done();
      });
  });
});