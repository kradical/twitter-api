const MAX_LIMIT = 1000;
const DEFAULT_LIMIT = 30;

const pagination = (req, res, next) => {
  let limit = Number(req.query.limit);
  let page = Number(req.query.page);

  if (Number.isNaN(limit)) {
    limit = DEFAULT_LIMIT;
  } else if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  if (Number.isNaN(page) || page < 0) {
    page = 0;
  }

  req.limit = limit;
  req.page = page;

  return next();
};

module.exports = pagination;
