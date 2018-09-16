const { Router } = require('express');

const User = require('../../../../models/User');
const pagination = require('../../../../middlewares/pagination');
const {
  makeTweetQuery,
  parseTweetQueryRequest,
  respondTweets,
  setupTweetQuery,
} = require('../../../../middlewares/tweets');

const router = new Router();

router.get('/users/:name/tweets',
  pagination,
  parseTweetQueryRequest,
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

      req.tweetQuery.where({ userId: user.id });
    } catch (err) {
      next(err);
    }

    return next();
  },
  makeTweetQuery,
  respondTweets);

module.exports = router;
