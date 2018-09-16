const querystring = require('querystring');
const url = require('url');

const Tweet = require('../models/Tweet');

const parseRetweets = (req) => {
  const retweetCount = Number(req.query.retweets);

  const doesExist = ![undefined, null, ''].includes(req.query.retweets);
  const isValidNumber = !Number.isNaN(retweetCount);

  if (doesExist && isValidNumber) {
    req.retweetCount = retweetCount;
  }
};

const parseDate = (req, field) => {
  const date = new Date(req.query[field]);

  const isValidDate = !Number.isNaN(date.getTime());

  if (isValidDate) {
    req[field] = date;
  }
};

const parseText = (req) => {
  req.textQuery = req.query.query;
};

const parseTweetQueryRequest = (req, res, next) => {
  parseRetweets(req);
  parseDate(req, 'after');
  parseDate(req, 'before');
  parseText(req);

  return next();
};

const setupTweetQuery = (req, res, next) => {
  req.tweetQuery = Tweet
    .query()
    .page(req.page, req.limit);

  if (typeof req.retweetCount === 'number') {
    req.tweetQuery.where('retweetCount', '>', req.retweetCount);
  }

  if (req.after instanceof Date) {
    req.tweetQuery.where('createdAt', '>', req.after);
  }

  if (req.before instanceof Date) {
    req.tweetQuery.where('createdAt', '<', req.before);
  }

  if (typeof req.textQuery === 'string') {
    req.tweetQuery.whereRaw('_search @@ plainto_tsquery(\'english\', ?)', [req.textQuery]);
  }

  return next();
};

// separate the query execution so middleware can be injected in between.
const makeTweetQuery = async (req, res, next) => {
  try {
    res.tweets = await req.tweetQuery;
  } catch (err) {
    return next(err);
  }

  return next();
};

const buildPageLink = (originalUrl, limit, page) => {
  const parsedUrl = url.parse(originalUrl, true);

  const newQuery = querystring.stringify({
    ...parsedUrl.query,
    limit,
    page,
  });

  return `${parsedUrl.protocol}://${parsedUrl.host}${parsedUrl.pathname}?${newQuery}`;
};

const respondTweets = (req, res) => {
  const originalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const { total } = res.tweets;

  const lastPage = Math.floor(total / req.limit);
  const prevPage = Math.max(req.page - 1, 0);
  const nextPage = Math.min(req.page + 1, lastPage);

  res.links({
    first: buildPageLink(originalUrl, req.limit, 0),
    prev: buildPageLink(originalUrl, req.limit, prevPage),
    self: buildPageLink(originalUrl, req.limit, req.page),
    next: buildPageLink(originalUrl, req.limit, nextPage),
    last: buildPageLink(originalUrl, req.limit, lastPage),
  });

  res.set('Total-Count', total);

  res.json(res.tweets.results);
};

module.exports = {
  makeTweetQuery,
  parseTweetQueryRequest,
  respondTweets,
  setupTweetQuery,
};
