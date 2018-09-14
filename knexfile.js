module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'twitter_api_dev',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
