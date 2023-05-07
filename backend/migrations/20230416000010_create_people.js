/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('people', (table) => {
    table.increments('person_id').primary();
    table.string('name', 150).notNullable();
    table.string('cpf', 11).notNullable().unique();

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // Delete the "people" table (Pessoas)
  return knex.schema.dropTable('people');
};
