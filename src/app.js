const express = require('express');

// init/bind knex
require('./db');

const allRouter = require('./routes');

const app = express();

app.use(allRouter);

// TODO: add eslint-disable
app.use((err, req, res, next) => {
  res
    .status(500)
    .json({
      status: 500,
      message: 'An unexpected error occurred.',
    });
});

app.listen(3000);
