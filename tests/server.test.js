'use strict';

require('dotenv').config();

describe('Media requests', () => {
  function seed() {
    let mediaLocation = './uploads/kidCast.png';
    let uploadUrl = 'http://localhost:3000/api/media/';
    superagent.post(uploadUrl)
      .attach('media', mediaLocation)
      .end((err, res) => {
        let amazonUrl = process.env.AWS_BUCKET + '.s3-us-west-2.amazonaws.com';
        let isAmazonUrl = res.body.imageUrl.includes(amazonUrl);
        res.send(isAmazonUrl);
      });
  }

  it('should return 200 for uploading a photo', done => {
    let imageLocation = './uploads/kidCast.png';
    let uploadUrl = 'http://localhost:3000/api/posts/upload';
    superagent.post(uploadUrl)
      .attach('picture', imageLocation)
      .end((err, res) => {
        let amazonUrl = process.env.AWS_BUCKET + '.s3-us-west-2.amazonaws.com';
        let isAmazonUrl = res.body.imageUrl.includes(amazonUrl);
        expect(isAmazonUrl).toBe(true);
        expect(res.status).toBe(200);
        done();
      });
  });

});