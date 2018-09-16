const { Router } = require('express');

const pagination = require('../../middlewares/pagination');
const {
  makeTweetQuery,
  parseTweetQueryRequest,
  respondTweets,
  setupTweetQuery,
} = require('../../middlewares/tweets');

const router = new Router();

router.get('/tweets',
  pagination,
  parseTweetQueryRequest,
  setupTweetQuery,
  makeTweetQuery,
  respondTweets);

module.exports = router;
