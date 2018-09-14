exports.up = knex => knex.schema
  .createTable('users', (table) => {
    table
      .increments('id')
      .primary();

    table
      .string('screenName')
      .unique()
      .notNullable();

    table
      .string('userName')
      .notNullable();
  })
  .createTable('tweets', (table) => {
    table
      .increments('id')
      .primary();

    table
      .bigInteger('tweetId')
      .unique()
      .notNullable();

    table
      .bigInteger('retweetCount')
      .notNullable();

    table
      .boolean('isRetweet')
      .notNullable();

    table
      .dateTime('createdAt')
      .notNullable();

    table
      .integer('favoriteCount')
      .notNullable();

    table
      .string('text')
      .notNullable();

    table
      .integer('userId')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });

exports.down = knex => knex.schema
  .dropTableIfExists('users')
  .dropTableIfExists('tweets');
