/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('invites', (table) => {
    table.increments('invite_id').primary();
    table.integer('vacancy_student_id').unsigned().notNullable();
    table.boolean('accept');
    table.date('deadline').notNullable();
    table.boolean('approved').notNullable();

    table
      .foreign('vacancy_student_id')
      .references('vacancies_students.vacancy_student_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')

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
