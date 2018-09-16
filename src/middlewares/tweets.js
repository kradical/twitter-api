const Tweet = require('../models/Tweet');

const parseRetweets = (retweets) => {
  const retweetCount = Number(retweets);

  const doesExist = ![undefined, null, ''].includes(retweets);
  const isValidNumber = !Number.isNaN(retweetCount);

  return doesExist && isValidNumber
    ? retweetCount
    : undefined;
};

const parseDate = (dateString) => {
  const date = new Date(dateString);

  const isValidDate = !Number.isNaN(date.getTime());

  return isValidDate
    ? date
    : undefined;
};

const parseText = (textQueryString) => {
  const isQueryValid = textQueryString && textQueryString !== '';

  return isQueryValid
    ? textQueryString
    : undefined;
};

const parseTweetQueryParams = (req) => {
  const retweetCount = parseRetweets(req.query.retweets);
  const after = parseDate(req.query.after);
  const before = parseDate(req.query.before);
  const textQuery = parseText(req.query.query);

  return {
    after,
    before,
    retweetCount,
    textQuery,
  };
};

const executeTweetQuery = async (req, res, next) => {
  const {
    after,
    before,
    retweetCount,
    textQuery,
  } = parseTweetQueryParams(req);

  const query = Tweet
    .query()
    .page(req.page, req.limit)
    .orderBy('createdAt');

  if (typeof retweetCount === 'number') {
    query.where('retweetCount', '>', retweetCount);
  }

  if (after instanceof Date) {
    query.where('createdAt', '>', after);
  }

  if (before instanceof Date) {
    query.where('createdAt', '<', before);
  }

  if (typeof textQuery === 'string') {
    query.whereRaw('_search @@ plainto_tsquery(\'english\', ?)', [textQuery]);
  }

  // user id can be set by previous middleware
  if (typeof req.userId === 'number') {
    query.where({ userId: req.userId });
  }


  try {
    const result = await query;

    res.entities = result.results;
    res.totalCount = result.total;
  } catch (err) {
    return next(err);
  }

  return next();
};

module.exports = {
  executeTweetQuery,
};
