/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('publication_types', (table) => {
    
    table.increments('publication_type_id').primary();

    table.string('publication_type', 150).notNullable();
    table.string('instructions', 500).notNullable();

    table.timestamps(true, true);

  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

  return knex.schema.dropTable('publication_types');

};
