const { Router } = require('express');

const Tweet = require('../../../models/Tweet');

const router = new Router();

const respond = (req, res) => {
  const status = res.tweet
    ? 200
    : 404;

  const body = res.tweet || { message: 'Tweet Not Found.', status: 404 };

  return res.status(status).json(body);
};

router.get('/tweets/:id',
  async (req, res, next) => {
    const tweetId = req.params.id;

    const isInvalid = Number.isNaN(Number(tweetId));

    if (isInvalid) {
      return res.status(400).json({
        message: 'Tweet id is not a valid number.',
        status: 400,
      });
    }

    try {
      res.tweet = await Tweet
        .query()
        .findOne({ tweetId });
    } catch (err) {
      return next(err);
    }

    return next();
  },
  respond);

module.exports = router;
