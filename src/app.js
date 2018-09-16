const express = require('express');

// init/bind knex
require('./db');

const allRouter = require('./routes');

const app = express();

app.use(allRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  res
    .status(500)
    .json({
      status: 500,
      message: 'An unexpected error occurred.',
    });
});

app.listen(3000);
