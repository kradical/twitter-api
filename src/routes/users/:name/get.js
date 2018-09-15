const { Router } = require('express');

const User = require('../../../models/User');

const router = new Router();

const respond = (req, res) => {
  const status = res.user
    ? 200
    : 404;

  const body = res.user || { message: 'User Not Found.', status: 404 };

  res.status(status).json(body);
};

router.get('/users/:name',
  async (req, res, next) => {
    const screenName = req.params.name;

    try {
      res.user = await User
        .query()
        .findOne({ screenName });
    } catch (err) {
      return next(err);
    }

    return next();
  },
  respond);

module.exports = router;
