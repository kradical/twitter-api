const { Router } = require('express');

const User = require('../../../models/User');
const { respond } = require('../../../middlewares/respond');

const router = new Router();

router.get('/users/:name',
  async (req, res, next) => {
    const screenName = req.params.name;

    try {
      res.entity = await User
        .query()
        .findOne({ screenName });
    } catch (err) {
      return next(err);
    }

    return next();
  },
  respond);

module.exports = router;
