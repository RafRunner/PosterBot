exports.up = function (knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments();
    table.string('element_id').notNullable();
    table.string('text');
    table.string('image_url');

    table.integer('page_id').notNullable();
    table.foreign('page_id').references('page.id').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('posts');
};
