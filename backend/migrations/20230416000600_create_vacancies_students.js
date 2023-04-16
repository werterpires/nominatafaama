/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('vacancies_students', (table) => {
    table.increments('vacancie_student_id').primary();
    table.string('comments', 500).notNullable();
    table.integer('vacancy_id').unsigned().notNullable();
    table.integer('student_id').unsigned().notNullable();

    table
      .foreign('vacancy_id')
      .references('vacancies.vacancy_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')

    table
      .foreign('student_id')
      .references('students.student_id')
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

  return knex.schema.dropTable('vacancies_students');
  
};
