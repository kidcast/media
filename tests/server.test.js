'use strict';

require('dotenv').config();

const superagent = require('superagent');

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