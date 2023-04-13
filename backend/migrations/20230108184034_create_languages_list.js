/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('languages_list', (table) => {
    
    table.increments('language_id').primary();

    table.string('language', 150).notNullable();

    table.timestamps(true, true);

  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

  return knex.schema.dropTable('language_list');

};
