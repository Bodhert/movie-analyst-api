const envPath = __dirname + "../.env";
require('dotenv').config({path:envPath})

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('API', () => {

  /*
    * Test the /GET route
    */
  describe('/GET home', () => {
    it('it should GET any reply', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

});
