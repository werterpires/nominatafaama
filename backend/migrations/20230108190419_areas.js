/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('areas', (table) => {
    table.increments('area_id').primary();

    table.string('area_name', 150).notNullable();

    table.float('area_extension', 150).notNullable();

    table.integer('macro_area_id').unsigned();

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('areas');
};
