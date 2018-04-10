'use strict';

jest.setTimeout(50000);

const server = require('../server.js');

require('dotenv').config();

const superagent = require('superagent');
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 3000;
const SERVER_URL = 'http://localhost:' + PORT;
const SIGNUP_URL = SERVER_URL + '/api/signup';
const SIGNIN_URL = SERVER_URL + '/api/signin';

describe('All Auth Tests', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  describe('Media Requests', () => {

    it('should return 200 for a get request for all media resources', done => {
      //sign Up
      let signUpUrl = `http://localhost:${process.env.PORT}/api/signup`;
      let signUpBody = {
        username: `randomUserTest${Math.random()}`,
        password: `randomPasswordTest${Math.random()}`,
        email: `${Math.random()}@email.com`
      };
      superagent.post(signUpUrl)
        .send(signUpBody)
        .end((err, res) => {
          if (err) {
            console.error('sign up error:', err);
          }
          let userId = res.body._id;
          //Sign In
          let signInUrl = `http://localhost:${process.env.PORT}/api/signin`;
          superagent.get(signInUrl)
            .auth(signUpBody.username, signUpBody.password)
            .end((err, res) => {
              let token = res.body.token;
              let mediaLocation = './uploads/child-running-in-playground.mp4';
              let newMedia = {
                title: `Test Title: ${Math.random()}`,
                description: `Test Description: ${Math.random()}`,
                category: `fun`,
                userId: userId,
              };
              // post new media
              let requestUrl = `http://localhost:${process.env.PORT}/api/media`;
              superagent.post(requestUrl)
                .field('title', newMedia.title)
                .field('description', newMedia.description)
                .field('category', newMedia.category)
                .field('userId', userId)
                .set('Authorization', 'Bearer ' + token)
                .attach('media', mediaLocation)
                .end((err, res) => {
                  let getUrl = `http://localhost:${process.env.PORT}/api/media`;
                  superagent.get(getUrl)
                    .end((err, res) => {
                      let isAnArray = Array.isArray(res.body);
                      expect(isAnArray).toBe(true);
                      done();
                    });
                });
            });
        });
    });

    it('should return 400 for a get request for one media resource that is not set to public', done => {
      //sign Up
      let signUpUrl = `http://localhost:${process.env.PORT}/api/signup`;
      let signUpBody = {
        username: `randomUserTest${Math.random()}`,
        password: `randomPasswordTest${Math.random()}`,
        email: `${Math.random()}@email.com`
      };
      superagent.post(signUpUrl)
        .send(signUpBody)
        .end((err, res) => {
          if (err) {
            console.error('sign up error:', err);
          }
          let userId = res.body._id;
          //Sign In
          let signInUrl = `http://localhost:${process.env.PORT}/api/signin`;
          superagent.get(signInUrl)
            .auth(signUpBody.username, signUpBody.password)
            .end((err, res) => {
              let token = res.body.token;
              let mediaLocation = './uploads/child-running-in-playground.mp4';
              let newMedia = {
                title: `Test Title: ${Math.random()}`,
                description: `Test Description: ${Math.random()}`,
                category: `fun`,
                userId: userId,
              };
              // post new media
              let requestUrl = `http://localhost:${process.env.PORT}/api/media`;
              superagent.post(requestUrl)
                .field('title', newMedia.title)
                .field('description', newMedia.description)
                .field('category', newMedia.category)
                .field('userId', userId)
                .set('Authorization', 'Bearer ' + token)
                .attach('media', mediaLocation)
                .end((err, res) => {
                  let amazonUrl = res.body.mediaUrl;
                  let getUrl = `http://localhost:${process.env.PORT}/api/media?id=${res.body._id}`;
                  superagent.get(getUrl)
                    .end((err, res) => {
                      expect(res.status).toBe(400);
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
              let mediaLocation = './uploads/child-running-in-playground.mp4';
              let newMedia = {
                title: `Test Title: ${Math.random()}`,
                description: `Test Description: ${Math.random()}`,
                category: `fun`,
                userId: userId,
              };
              // post new media
              let uploadUrl = `http://localhost:${process.env.PORT}/api/media`;
              superagent.post(uploadUrl)
                .field('title', newMedia.title)
                .field('description', newMedia.description)
                .field('category', newMedia.category)
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

    it('should return 200 for updating a media resource\'s information', done => {
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
              let mediaLocation = './uploads/child-running-in-playground.mp4';
              let newMedia = {
                title: `Test Title: ${Math.random()}`,
                description: `Test Description: ${Math.random()}`,
                category: `fun`,
                userId: userId,
              };
              // post new media
              let uploadUrl = `http://localhost:${process.env.PORT}/api/media`;
              superagent.post(uploadUrl)
                .field('title', newMedia.title)
                .field('description', newMedia.description)
                .field('category', newMedia.category)
                .field('userId', userId)
                .set('Authorization', 'Bearer ' + token)
                .attach('media', mediaLocation)
                .end((err, res) => {
                  let mediaId = res.body._id;
                  let updateUrl = `http://localhost:${process.env.PORT}/api/media?id=${mediaId}`;
                  let newMediaSettings = {
                    title: `new title ${Math.random()}`,
                    description: `new description ${Math.random()}`,
                    category: `fun`
                  };
                  // updated the media
                  superagent.put(updateUrl)
                    .set('Authorization', 'Bearer ' + token)
                    .send(newMediaSettings)
                    .end((err, res) => {
                      let updatedTitle = res.body.title;
                      expect(updatedTitle).toBe(newMediaSettings.title);
                      expect(res.status).toBe(200);
                      done();
                    });
                });
            });
        });
    });

    it('should return 403 for updating a media resource\'s information when the user does not have permission for the resource', done => {
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
        .send(signUpBody)
        .end((err, res) => {
          let userId = res.body._id;
          //Sign In
          let signInUrl = `http://localhost:${process.env.PORT}/api/signin`;
          superagent.get(signInUrl)
            .auth(signUpBody.username, signUpBody.password)
            .end((err, res) => {
              let token = res.body.token;
              let mediaLocation = './uploads/child-running-in-playground.mp4';
              let newMedia = {
                title: `Test Title: ${Math.random()}`,
                description: `Test Description: ${Math.random()}`,
                category: `fun`,
                userId: userId,
              };
              // post new media
              let uploadUrl = `http://localhost:${process.env.PORT}/api/media`;
              superagent.post(uploadUrl)
                .field('title', newMedia.title)
                .field('description', newMedia.description)
                .field('category', newMedia.category)
                .field('userId', userId)
                .set('Authorization', 'Bearer ' + token)
                .attach('media', mediaLocation)
                .end((err, res) => {
                  // create second account
                  let mediaId = res.body._id;
                  let updateUrl = `http://localhost:${process.env.PORT}/api/media?id=${mediaId}`;
                  let signUpBody2 = {
                    username: `randomUserTest${Math.random()}`,
                    password: `randomPasswordTest${Math.random()}`,
                    email: `${Math.random()}@email.com`
                  };
                  superagent.post(signUpUrl)
                    .auth(signUpBody2.username, signUpBody2.password)
                    .set('Content-Type', 'application/json')
                    .send(signUpBody2)
                    .end((err, res) => {
                      // signin to second account
                      superagent.get(signInUrl)
                        .auth(signUpBody2.username, signUpBody2.password)
                        .end((err, res) => {
                          let token2 = res.body.token;
                          let newMediaSettings = {
                            title: `new title ${Math.random()}`,
                            description: `new description ${Math.random()}`,
                            category: `fun`
                          };
                          // updated the media
                          superagent.put(updateUrl)
                            .set('Authorization', 'Bearer ' + token2)
                            .send(newMediaSettings)
                            .end((err, res) => {
                              let updatedTitle = res.body.title;
                              expect(res.status).toBe(403);
                              done();
                            });
                        });
                    });
                });
            });
        });
    });

    it('should return 400 for updating a nonexistent resource', done => {
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
              let mediaLocation = './uploads/child-running-in-playground.mp4';
              let newMedia = {
                title: `Test Title: ${Math.random()}`,
                description: `Test Description: ${Math.random()}`,
                category: `fun`,
                userId: userId,
              };
              let mediaId = '123';
              let updateUrl = `http://localhost:${process.env.PORT}/api/media?id=${mediaId}`;
              let newMediaSettings = {
                title: `new title ${Math.random()}`,
                description: `new description ${Math.random()}`,
                category: `fun`
              };
              // update non existent media
              superagent.put(updateUrl)
                .set('Authorization', 'Bearer ' + token)
                .send(newMediaSettings)
                .end((err, res) => {
                  expect(res.status).toBe(400);
                  done();
                });
            });
        });
    });


    it('should return 204 for deleting a resource', done => {
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
              let mediaLocation = './uploads/child-running-in-playground.mp4';
              let newMedia = {
                title: `Test Title: ${Math.random()}`,
                description: `Test Description: ${Math.random()}`,
                category: `fun`,
                userId: userId,
              };
              // post new media
              let uploadUrl = `http://localhost:${process.env.PORT}/api/media`;
              superagent.post(uploadUrl)
                .field('title', newMedia.title)
                .field('description', newMedia.description)
                .field('category', newMedia.category)
                .field('userId', userId)
                .set('Authorization', 'Bearer ' + token)
                .attach('media', mediaLocation)
                .end((err, res) => {
                  let mediaId = res.body._id;
                  let deleteUrl = `http://localhost:${process.env.PORT}/api/media?id=${mediaId}`;
                  // updated the media
                  superagent.delete(deleteUrl)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                      expect(res.status).toBe(204);
                      done();
                    });
                });
            });
        });
    });

    it('should return 403 for deleting a media resource\'s information when the user does not have permission for the resource', done => {
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
        .send(signUpBody)
        .end((err, res) => {
          let userId = res.body._id;
          //Sign In
          let signInUrl = `http://localhost:${process.env.PORT}/api/signin`;
          superagent.get(signInUrl)
            .auth(signUpBody.username, signUpBody.password)
            .end((err, res) => {
              let token = res.body.token;
              let mediaLocation = './uploads/child-running-in-playground.mp4';
              let newMedia = {
                title: `Test Title: ${Math.random()}`,
                description: `Test Description: ${Math.random()}`,
                category: `fun`,
                userId: userId,
              };
              // post new media
              let uploadUrl = `http://localhost:${process.env.PORT}/api/media`;
              superagent.post(uploadUrl)
                .field('title', newMedia.title)
                .field('description', newMedia.description)
                .field('category', newMedia.category)
                .field('userId', userId)
                .set('Authorization', 'Bearer ' + token)
                .attach('media', mediaLocation)
                .end((err, res) => {
                  // create second account
                  let mediaId = res.body._id;
                  let updateUrl = `http://localhost:${process.env.PORT}/api/media?id=${mediaId}`;
                  let signUpBody2 = {
                    username: `randomUserTest${Math.random()}`,
                    password: `randomPasswordTest${Math.random()}`,
                    email: `${Math.random()}@email.com`
                  };
                  superagent.post(signUpUrl)
                    .auth(signUpBody2.username, signUpBody2.password)
                    .set('Content-Type', 'application/json')
                    .send(signUpBody2)
                    .end((err, res) => {
                      // signin to second account
                      superagent.get(signInUrl)
                        .auth(signUpBody2.username, signUpBody2.password)
                        .end((err, res) => {
                          let token2 = res.body.token;
                          // delete the media
                          superagent.delete(updateUrl)
                            .set('Authorization', 'Bearer ' + token2)
                            .end((err, res) => {
                              expect(res.status).toBe(403);
                              done();
                            });
                        });
                    });
                });
            });
        });
    });


  }); // Media tests end.

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
});
