const MAX_LIMIT = 100;

const pagination = (req, res, next) => {
  let limit = Number(req.query.limit);
  let page = Number(req.query.page);

  if (Number.isNaN(limit) || limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  if (Number.isNaN(page)) {
    page = 0;
  }

  req.limit = limit;
  req.page = page;

  return next();
};

module.exports = pagination;
