const { assert } = require('chai');

const { requester } = require('../../../../globals');

const User = require('../../../../../src/models/User');

const userFactory = require('../../../../factories/User');

describe('Getting a user by screen name', () => {
  let user;

  before(async () => {
    await User.query().delete();
    user = await userFactory();
  });

  it('should return the matching tweet if it exists', async () => {
    const res = await requester.get(`/users/${user.screenName}`);

    assert.strictEqual(res.body.id, user.id);
  });

  it('should 404 if a tweet with the specified id does not exist', async () => {
    const res = await requester.get('/users/NotExist');

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.status, 404);
  });
});
