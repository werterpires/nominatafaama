/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('languages', (table) => {
    table.increments('language_id').primary();

    table.string('chosen_language', 150).notNullable();

    table.boolean('read', 250).notNullable();
    table.boolean('understand', 250).notNullable();
    table.boolean('speak', 250).notNullable();
    table.boolean('write', 250).notNullable();
    table.boolean('fluent', 250).notNullable();
    table.boolean('unknown', 250).notNullable();
    table.integer('person_id');

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
