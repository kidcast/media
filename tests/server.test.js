'use strict';

require('dotenv').config();

const superagent = require('superagent');
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 3000;
const SERVER_URL = 'http://localhost:' + PORT;
const SIGNUP_URL = SERVER_URL + '/api/signup';
const SIGNIN_URL = SERVER_URL + '/api/signin';

describe('Media Sunny Day Requests', () => {

  it('should return 200 for a get request for one media resource', done => {
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
        let userId = res.body._id;
        //Sign In
        let signInUrl = `http://localhost:${process.env.PORT}/api/signin`;
        superagent.get(signInUrl)
          .auth(signUpBody.username, signUpBody.password)
          .end((err, res) => {
            let token = res.body.token;
            let mediaLocation = './uploads/kidMusic.png';
            let newMedia = {
              title: `Test Title: ${Math.random()}`,
              description: `Test Description: ${Math.random()}`,
              category: `Test Category: ${Math.random()}`,
              type: `Test Type: ${Math.random()}`,
              userId: userId,
              public: false
            };
            // post new media
            let requestUrl = `http://localhost:${process.env.PORT}/api/media`;
            superagent.post(requestUrl)
              .field('title', newMedia.title)
              .field('description', newMedia.description)
              .field('category', newMedia.category)
              .field('type', newMedia.type)
              .field('userId', userId)
              .set('Authorization', 'Bearer ' + token)
              .attach('media', mediaLocation)
              .end((err, res) => {
                let amazonUrl = res.body.mediaUrl;
                let getUrl = `http://localhost:${process.env.PORT}/api/media?id=${res.body._id}`;
                superagent.get(getUrl)
                  .set('Authorization', 'Bearer ' + token)
                  .end((err, res) => {
                    let fetchedAmazonUrl = res.body.mediaUrl;
                    expect(fetchedAmazonUrl).toBe(amazonUrl);
                    expect(res.status).toBe(200);
                    done();
                  });
              });
          });
      });
  });

  it('should return 200 for uploading a media resource and include proper AWS url', done => {
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
        let userId = res.body._id;
        //Sign In
        let signInUrl = `http://localhost:${process.env.PORT}/api/signin`;
        superagent.get(signInUrl)
          .auth(signUpBody.username, signUpBody.password)
          .end((err, res) => {
            let token = res.body.token;
            let mediaLocation = './uploads/kidMusic.png';
            let newMedia = {
              title: `Test Title: ${Math.random()}`,
              description: `Test Description: ${Math.random()}`,
              category: `Test Category: ${Math.random()}`,
              type: `Test Type: ${Math.random()}`,
              userId: userId,
              public: false
            };
            // post new media
            let uploadUrl = `http://localhost:${process.env.PORT}/api/media`;
            superagent.post(uploadUrl)
              .field('title', newMedia.title)
              .field('description', newMedia.description)
              .field('category', newMedia.category)
              .field('type', newMedia.type)
              .field('userId', userId)
              .set('Authorization', 'Bearer ' + token)
              .attach('media', mediaLocation)
              .end((err, res) => {
                let amazonUrl = 'amazonaws.com';
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
    username: `bill${Math.random()}`,
    email: `bill${Math.random()}@microsoft.com`,
    password: 'windows95'
  };
};

describe('/api/signup', () => {
  it('should return the username, password and email on successful signup', (done) => {
    let tempUser = new TestUser(getUserParams());
    superagent.post(SIGNUP_URL)
      .set('Content-Type', 'application/json')
      .send(tempUser)
      .catch(err => {
        expect(tempUser.username).toEqual('bill');
        expect(tempUser.password).toEqual('windows95');
        expect(tempUser.email).toEqual('bill@microsoft.com');
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
      .auth(params.username, params.password)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(params))
      .then(res => {
        expect(res.status).toEqual(200);
        done();
      });
  });
});

describe('/api/signin', () => {
  it.only('should return user with a hashed password and token', (done) => {
    let authUser = new TestUser(getUserParams());
    console.log('authUser', authUser);
    // let params = getUserParams();
    let hashedUser = authUser.bcrypt.hash(this.password, 10).then(hash => {
      this.password = hash;
    });
    console.log('hashedUser', hashedUser);

    superagent.get(SIGNIN_URL)
      .set('Content-Type', 'application/json')
      .send(hashedUser)
      .then(res => {
        expect(hashedUser).toBe(true);

        // return superagent.get(SIGNIN_URL)
        //   .set('Authorization', 'Basic ' + encoded);
      // })
      // .then(res => {
      //   expect(res.status).toBe(true);
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
