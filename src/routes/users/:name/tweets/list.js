const { Router } = require('express');

const Tweet = require('../../../../models/Tweet');
const User = require('../../../../models/User');
const pagination = require('../../../../middlewares/pagination');
const { setupTweetQuery, respondTweets } = require('../../../../middlewares/tweets');

const router = new Router();

router.get('/users/:name/tweets',
  pagination,
  setupTweetQuery,
  async (req, res, next) => {
    const screenName = req.params.name;

    try {
      const user = await User
        .query()
        .findOne({ screenName });

      if (!user) {
        return res.status(404).json({
          message: 'User Not Found.',
          status: 404,
        });
      }

      res.tweets = await Tweet
        .query()
        .where({ userId: user.id })
        .where('retweetCount', '>', req.retweetCount)
        .where('createdAt', '>', req.after)
        .where('createdAt', '<', req.before)
        .page(req.page, req.limit);
    } catch (err) {
      next(err);
    }

    return next();
  },
  respondTweets);

module.exports = router;
