/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('tax_types', (table) => {
    table.increments('tax_type_id').primary();

    table.string('tax_type_name', 150).notNullable();

    table.string('tax_type_description', 250).notNullable();

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('tax_types');
};
