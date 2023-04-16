/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('unions', (table) => {
    table.increments('union_id').primary();

    table.string('union_name', 150).notNullable();

    table.string('union_acronym', 250).notNullable();

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('unions');
};
