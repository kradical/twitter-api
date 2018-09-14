exports.up = knex => knex.schema
  .createTable('users', (table) => {
    table.increments('id').primary();
    table.string('screenName').notNullable();
    table.string('userName').notNullable();
  })
  .createTable('tweets', (table) => {
    table.increments('id').primary();
    table.integer('favoriteCount').notNullable();
    table.boolean('isRetweet').notNullable();
    table.integer('retweetCount').notNullable();
    table.string('text').notNullable();
    table.dateTime('createdAt').notNullable();
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
