// create username
// create password
// upload videos 
// filter content
//sign up/sign in

describe('signup', () => {

  it('should return status of XXX if name taken', (done) => {

    // database must be empty
    superagent.post('/signup', {name:'john-doe',password:'pass'})
      .then(result => {

        superagent.post('/signup', {name:'john-doe',password:'word'}, () => {

          let expected = 'some code that means name taken';
          let actual = result;
          expect(actual).toBe(expected);
          done();
        });
        
      });

  })
});



/*

sum - numA, numB

  if either number NOT a number then return null

  returns numA + numB
  
function sum(a, b) {
  if(a === NaN || b === NaN) {
    return null;
  }
  return a + b;
}


*/