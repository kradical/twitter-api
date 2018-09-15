const { Router } = require('express');

const Tweet = require('../../models/Tweet');
const pagination = require('../../middlewares/pagination');
const { setupTweetQuery, respondTweets } = require('../../middlewares/tweets');

const router = new Router();

router.get('/tweets',
  pagination,
  setupTweetQuery,
  async (req, res, next) => {
    try {
      res.tweets = await Tweet
        .query()
        .where('retweetCount', '>', req.retweetCount)
        .where('createdAt', '>', req.after)
        .where('createdAt', '<', req.before)
        .page(req.page, req.limit);
    } catch (err) {
      return next(err);
    }

    return next();
  },
  respondTweets);

module.exports = router;
