/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('vacancies', (table) => {
    table.increments('vacancy_id').primary();
    table.string('title', 150).notNullable();
    table.string('description', 300).notNullable();
    table.integer('field_id').notNullable;
    table.integer('rep_id').unsigned().notNullable();
    table.integer('ministry_id').unsigned().notNullable();

    table
      .foreign('rep_id')
      .references('field_reps.rep_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');

    table
      .foreign('field_id')
      .references('associations.association_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
    table
      .foreign('ministry_id')
      .references('ministry_types.ministry_type_id')
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

  return knex.schema.dropTable('vacancies');
  
};
