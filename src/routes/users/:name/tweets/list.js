const { Router } = require('express');

const User = require('../../../../models/User');
const {
  parsePaginationQueryParams,
  setPaginationHeaders,
} = require('../../../../middlewares/pagination');
const { respond } = require('../../../../middlewares/respond');
const { executeTweetQuery } = require('../../../../middlewares/tweets');

const router = new Router();

const loadUser = async (req, res, next) => {
  const screenName = req.params.name;

  try {
    const user = await User
      .query()
      .findOne({ screenName });

    if (!user) {
      return res.status(404).json({
        message: 'User Not Found.',
        status: 404,
      });
    }

    req.userId = user.id;
  } catch (err) {
    next(err);
  }

  return next();
};

router.get('/users/:name/tweets',
  parsePaginationQueryParams,
  loadUser,
  executeTweetQuery,
  setPaginationHeaders,
  respond);

module.exports = router;
