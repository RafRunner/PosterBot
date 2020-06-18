exports.up = function (knex) {
  return knex.schema.createTable('pages', (table) => {
    table.increments();
    table.string('url').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('pages');
};
