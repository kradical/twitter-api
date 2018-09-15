const DISTANT_PAST = new Date('1900-01-01');
const DISTANT_FUTURE = new Date('2200-01-01');

const setupTweetQuery = (req, res, next) => {
  let retweetCount = Number(req.query.retweets);

  if (Number.isNaN(retweetCount)) {
    retweetCount = 0;
  }

  let after = req.query.after && new Date(req.query.after);

  if (!after || Number.isNaN(after.getTime())) {
    after = DISTANT_PAST;
  }

  let before = req.query.before && new Date(req.query.before);

  if (!before || Number.isNaN(before.getTime())) {
    before = DISTANT_FUTURE;
  }

  req.retweetCount = retweetCount;
  req.after = after;
  req.before = before;
  req.stringQuery = req.query.query;

  return next();
};

const respondTweets = (req, res) => {
  res.set('Total-Count', res.tweets.total);
  res.json(res.tweets.results);
};

module.exports = {
  setupTweetQuery,
  respondTweets,
}
