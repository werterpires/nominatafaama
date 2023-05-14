/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('nominatas', (table) => {
    table.increments('nominata_id').primary();
    table.string('year', 4).notNullable();
    table.date('orig_field_invites_begin').notNullable()
    table.string('director_words', 4).notNullable();
    table.string('director_photo', 4).notNullable();

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

  return knex.schema.dropTable('nominatas');
  
};
