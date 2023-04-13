/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('itens', (table) => {
    table.increments('item_id').primary();

    table.string('item_name', 150).notNullable();

    table.string('item_description', 150).notNullable();

    table.boolean('is_service').notNullable();

    table.float('depreciation_rate');

    table.integer('subcategory_id').unsigned();

    table
      .foreign('subcategory_id')
      .references('itens_subcategory.subcategory_id')
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
  return knex.schema.dropTable('itens');
};
