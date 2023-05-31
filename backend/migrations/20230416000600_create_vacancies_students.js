/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('vacancies_students', (table) => {
    table.increments('vacancy_student_id').primary()
    table.string('comments', 500).notNullable()
    table.integer('vacancy_id').unsigned().notNullable()
    table.integer('student_id').unsigned().notNullable()

    table.foreign('vacancy_id').references('vacancies.vacancy_id')

    table.foreign('student_id').references('students.student_id')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('vacancies_students')
}
