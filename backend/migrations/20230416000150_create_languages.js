/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('languages', (table) => {
    table.increments('language_id').primary();

    table.integer('chosen_language').unsigned().notNullable();

    table.boolean('read').notNullable();
    table.boolean('understand').notNullable();
    table.boolean('speak').notNullable();
    table.boolean('write').notNullable();
    table.boolean('fluent').notNullable();
    table.boolean('unknown').notNullable();
    table.integer('person_id').unsigned().notNullable();
    table.boolean('language_approved').notNullable()

    table
      .foreign('person_id')
      .references('people.person_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');

    table
      .foreign('chosen_language')
      .references('languages_list.language_id')
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
  return knex.schema.dropTable('languages');
};
