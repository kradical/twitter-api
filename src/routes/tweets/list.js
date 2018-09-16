const { Router } = require('express');

const {
  parsePaginationQueryParams,
  setPaginationHeaders,
} = require('../../middlewares/pagination');
const { respond } = require('../../middlewares/respond');
const { executeTweetQuery } = require('../../middlewares/tweets');

const router = new Router();

router.get('/tweets',
  parsePaginationQueryParams,
  executeTweetQuery,
  setPaginationHeaders,
  respond);

module.exports = router;
