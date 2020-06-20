exports.up = function (knex) {
  return knex.schema.alterTable('posts', function (table) {
    table.string('tweet_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('posts', function (table) {
    table.dropColumn('tweet_id');
  });
};
