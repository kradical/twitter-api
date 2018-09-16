const querystring = require('querystring');
const url = require('url');

const MAX_LIMIT = 1000;
const DEFAULT_LIMIT = 30;

const parsePaginationQueryParams = (req, res, next) => {
  let limit = Number(req.query.limit);
  let page = Number(req.query.page);

  const isLimitInvalid = Number.isNaN(limit);
  const isPageInvalid = Number.isNaN(page);

  if (isLimitInvalid) {
    limit = DEFAULT_LIMIT;
  } else if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  if (isPageInvalid || page < 0) {
    page = 0;
  }

  req.limit = limit;
  req.page = page;

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

const setPaginationHeaders = (req, res, next) => {
  const originalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  const lastPage = Math.floor(res.totalCount / req.limit);
  const prevPage = Math.max(req.page - 1, 0);
  const nextPage = Math.min(req.page + 1, lastPage);

  res.links({
    first: buildPageLink(originalUrl, req.limit, 0),
    prev: buildPageLink(originalUrl, req.limit, prevPage),
    self: buildPageLink(originalUrl, req.limit, req.page),
    next: buildPageLink(originalUrl, req.limit, nextPage),
    last: buildPageLink(originalUrl, req.limit, lastPage),
  });

  res.set('Total-Count', res.totalCount);

  return next();
};

module.exports = {
  parsePaginationQueryParams,
  setPaginationHeaders,
};
