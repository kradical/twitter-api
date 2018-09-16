const { assert } = require('chai');

const { requester } = require('../../../globals');

const Tweet = require('../../../../src/models/Tweet');

const tweetFactory = require('../../../factories/Tweet');

describe('Getting a list of tweets', () => {
  let futureTweet;
  let pastTweet;
  let retweetedTweet;
  let textTweet;

  before(async () => {
    await Tweet.query().delete();
    [pastTweet, retweetedTweet, textTweet, futureTweet] = await Promise.all([
      tweetFactory({ createdAt: new Date('1999-01-01') }),
      tweetFactory({ createdAt: new Date('2010-01-01'), retweetCount: 10 }),
      tweetFactory({ createdAt: new Date('2010-01-02'), text: 'search for kappa' }),
      tweetFactory({ createdAt: new Date('2100-01-01') }),
    ]);
  });

  describe('with no filters', () => {
    it('should return all tweets', async () => {
      const res = await requester.get('/tweets');

      assert.lengthOf(res.body, 4);
    });

    describe('with pagination limit/page', () => {
      it('should return the limited amount of entities', async () => {
        const res = await requester.get('/tweets?limit=2');

        assert.lengthOf(res.body, 2);
      });

      // ordered by createdAt
      it('should return the second page if specified', async () => {
        const res = await requester.get('/tweets?limit=2&page=1');

        assert.lengthOf(res.body, 2);
        assert.strictEqual(res.body[0].id, textTweet.id);
        assert.strictEqual(res.body[1].id, futureTweet.id);
      });
    });
  });

  describe('filtering by before', () => {
    it('should only return tweets before the date', async () => {
      const res = await requester.get('/tweets?before=2000-01-01');

      assert.lengthOf(res.body, 1);
      assert.strictEqual(res.body[0].id, pastTweet.id);
    });
  });

  describe('filtering by after', () => {
    it('should only return tweets after the date', async () => {
      const res = await requester.get('/tweets?after=2099-01-01');

      assert.lengthOf(res.body, 1);
      assert.strictEqual(res.body[0].id, futureTweet.id);
    });
  });

  describe('filtering by retweets', () => {
    it('should only return tweets with greater retweets', async () => {
      const res = await requester.get('/tweets?retweets=5');

      assert.lengthOf(res.body, 1);
      assert.strictEqual(res.body[0].id, retweetedTweet.id);
    });
  });

  describe('filtering by text query', () => {
    it('should only return tweets that match the text', async () => {
      const res = await requester.get('/tweets?query=kappa');

      assert.lengthOf(res.body, 1);
      assert.strictEqual(res.body[0].id, textTweet.id);
    });
  });
});
