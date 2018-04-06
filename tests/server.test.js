'use strict';

require('dotenv').config();

const superagent = require('superagent');

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
