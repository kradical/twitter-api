const { assert } = require('chai');

const { requester } = require('../../../../globals');

const Tweet = require('../../../../../src/models/Tweet');

const tweetFactory = require('../../../../factories/Tweet');

describe('Getting a tweet by id', () => {
  before(async () => {
    await Tweet.query().delete();
    await tweetFactory({ tweetId: 1 });
  });

  it('should return the matching tweet if it exists', async () => {
    const res = await requester.get('/tweets/1');

    assert.strictEqual(res.body.tweetId, '1');
  });

  it('should 404 if a tweet with the specified id does not exist', async () => {
    const res = await requester.get('/tweets/2');

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.status, 404);
  });

  it('should 400 if an invalid number is specified', async () => {
    const res = await requester.get('/tweets/abc');

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.status, 400);
  });

  it('should 400 if an non-numeric constant is specified', async () => {
    const res = await requester.get('/tweets/1e3');

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.status, 400);
  });
});
