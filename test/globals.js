const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../src/app');

chai.use(chaiHttp);

const requester = chai.request(app).keepOpen();

after(() => requester.close());

module.exports = {
  requester,
};
