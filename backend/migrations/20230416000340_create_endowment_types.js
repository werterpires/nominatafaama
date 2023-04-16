/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('endowment_types', (table) => {
    table.increments('endowment_type_id').primary();

    table.string('endowment_type_name', 150).notNullable();
    table.integer('application').notNullable();

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('endowment_types');
};
