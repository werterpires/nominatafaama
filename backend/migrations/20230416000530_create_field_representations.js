/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('field_representations', (table) => {
    table.increments('representation_id').primary();
    
    table.integer('rep_id').unsigned().notNullable();
    table.integer('represented_field_id').unsigned().notNullable;
    table.string('function', 250).notNullable;
    table.boolean('rep_approved').notNullable()
    table.date('rep_active_validate').notNullable()

    table
      .foreign('rep_id')
      .references('field_reps.rep_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
    table
      .foreign('represented_field_id')
      .references('associations.association_id')
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

  return knex.schema.dropTable('field_representations');
  
};
