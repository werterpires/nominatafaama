/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('wallets', (table) => {
    table.increments('wallet_id').primary();

    table.string('wallet_name', 150).notNullable();

    table.string('wallet_description', 150).notNullable();

    table.float('wallet_inicial_value').notNullable();

    table.float('wallet_value').notNullable();

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('wallets');
};
