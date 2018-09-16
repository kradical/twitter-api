const { Router } = require('express');

const Tweet = require('../../../models/Tweet');
const { respond } = require('../../../middlewares/respond');

const router = new Router();

router.get('/tweets/:id',
  async (req, res, next) => {
    const tweetId = req.params.id;

    const isValid = /^\d+$/.test(tweetId);

    if (!isValid) {
      return res.status(400).json({
        message: 'Tweet id is not a valid number.',
        status: 400,
      });
    }

    try {
      res.entity = await Tweet
        .query()
        .findOne({ tweetId });
    } catch (err) {
      return next(err);
    }

    return next();
  },
  respond);

module.exports = router;
