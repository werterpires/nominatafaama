/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('children', (table) => {
    table.increments('child_id').primary()

    table.date('child_birth_date').notNullable()
    table.string('study_grade', 150).notNullable()
    table.integer('marital_status_id').unsigned().notNullable()
    table.integer('person_id').unsigned().notNullable()
    table.integer('student_id').unsigned().notNullable()
    table.boolean('child_approved')

    table.foreign('person_id').references('people.person_id')
    table.foreign('student_id').references('students.student_id')
    table
      .foreign('marital_status_id')
      .references('marital_status_types.marital_status_type_id')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('children')
}
