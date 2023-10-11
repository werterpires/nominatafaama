/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('vacancies', (table) => {
    table.increments('vacancy_id').primary();
    table.string('title', 150).notNullable();
    table.string('description', 300).notNullable();
    table.integer('field_id').unsigned().notNullable();
    table.integer('rep_id').unsigned();
    table.integer('ministry_id').unsigned();

    table.foreign('rep_id').references('field_reps.rep_id');

    table.foreign('field_id').references('associations.association_id');
    table.foreign('ministry_id').references('ministry_types.ministry_type_id');

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
