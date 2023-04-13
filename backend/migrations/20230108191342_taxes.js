/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('taxes', (table) => {
    table.increments('tax_id').primary();

    table.string('tax_name', 150).notNullable();

    table.string('tax_description', 150).notNullable();

    table.integer('tax_type_id').unsigned().notNullable();

    table
      .foreign('tax_type_id')
      .references('tax_types.tax_type_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('taxes');
};
