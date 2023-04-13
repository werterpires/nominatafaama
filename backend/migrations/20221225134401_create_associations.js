/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('associations', (table) => {
    table.increments('association_id').primary();
    table.string('association_name', 150).notNullable();
    table.string('association_acronym', 250).notNullable();
    table.integer('union_id').unsigned();
    table
      .foreign('union_id')
      .references('unions.union_id')
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
  return knex.schema.dropTable('associations');
};
