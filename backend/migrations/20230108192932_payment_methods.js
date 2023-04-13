/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('payment_methods', (table) => {
    table.increments('payment_method_id').primary();

    table.string('payment_method_name', 150).notNullable();

    table.string('payment_method_description', 150).notNullable();

    table.float('payment_method_limit');

    table.integer('due_date');

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('payment_methods');
};
