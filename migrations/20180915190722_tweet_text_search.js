const addTweetTextSearch = `
  ALTER TABLE tweets ADD _search tsvector;

  UPDATE tweets SET _search = to_tsvector('english', 'text');

  CREATE INDEX tweets_text_search ON tweets USING gin(_search);

  CREATE TRIGGER tweets_text_search_vector_update
  BEFORE INSERT OR UPDATE ON tweets
  FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(_search, 'pg_catalog.english', 'text');
`;

const removeTweetTextSearch = `
  DROP TRIGGER tweets_text_search_vector_update ON tweets;
  DROP INDEX tweets_text_search;
  ALTER TABLE tweets DROP COLUMN _search;
`;

exports.up = knex => knex.schema.raw(addTweetTextSearch);

exports.down = knex => knex.schema.raw(removeTweetTextSearch);
