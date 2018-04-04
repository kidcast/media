'use strict';

require('dotenv').config();

const superagent = require('superagent');

describe('Media requests', () => {
  // function seed() {
  //   let mediaLocation = './uploads/kidCast.png';
  //   let uploadUrl = 'http://localhost:3000/api/media/';
  //   superagent.post(uploadUrl)
  //     .attach('media', mediaLocation)
  //     .end((err, res) => {
  //       let amazonUrl = process.env.AWS_BUCKET + '.s3-us-west-2.amazonaws.com';
  //       let isAmazonUrl = res.body.imageUrl.includes(amazonUrl);
  //       res.send(isAmazonUrl);
  //     });
  // }

  it('should return 200 for uploading a photo and include proper AWS url', done => {
    let mediaLocation = './uploads/kidMusic.png';
    let uploadUrl = `${process.env.DATABASE_URL}/api/media/`;
    console.log('upload url', uploadUrl);
    let newMedia = {
      title: `Test Title: ${Math.random()}`,
      description: `Test Description: ${Math.random()}`,
      // userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      category: `Test Category: ${Math.random()}`,
      type: `Test Type: ${Math.random()}`,
      public: false
    };
    superagent.post(uploadUrl)
      .field('title', newMedia.title)
      .attach('media', mediaLocation)
      .end((err, res) => {
        let amazonUrl = process.env.AWS_BUCKET + '.s3.amazonaws.com';
        let isAmazonUrl = res.body.mediaUrl.includes(amazonUrl);
        expect(isAmazonUrl).toBe(true);
        expect(res.status).toBe(200);
        done();
      });
  });

});