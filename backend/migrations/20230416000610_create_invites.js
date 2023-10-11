/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('invites', (table) => {
    table.increments('invite_id').primary();
    table.integer('vacancy_student_id').unsigned().notNullable();
    table.boolean('accept');
    table.date('deadline').notNullable();
    table.boolean('approved');

    table
      .foreign('vacancy_student_id')
      .references('vacancies_students.vacancy_student_id');

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('invites');
};
