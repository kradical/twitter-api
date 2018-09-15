const { Router } = require('express');

const getTweetById = require('./tweets/:id/get');
const listTweets = require('./tweets/list');
const getUserByName = require('./users/:name/get');
const listUserTweetsByName = require('./users/:name/tweets/list');

const router = new Router();

router.use(getTweetById);
router.use(listTweets);
router.use(getUserByName);
router.use(listUserTweetsByName);

module.exports = router;
