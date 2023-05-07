/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('fields_invites_begins', (table) => {
    table.increments('fields_invites_id').primary();
    table.date('orig_field_invites_begin').notNullable()
    table.integer('field_id').unsigned().notNullable()
    table.integer('nominata_id').unsigned().notNullable()

    table
      .foreign('field_id')
      .references('associations.association_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')

    table
      .foreign('nominata_id')
      .references('nominatas.nominata_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')

    table.timestamps(true, true)

  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

  return knex.schema.dropTable('fields_invites_begins');
  
};
