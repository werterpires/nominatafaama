/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('previous_marriages', (table) => {
    table.increments('previous_marriage_id').primary()
    table.date('marriage_end_date').notNullable()
    table.integer('student_id').unsigned().notNullable()
    table.boolean('previous_marriage_approved')
    table.foreign('student_id').references('students.student_id')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex} knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('previous_marriages')
}
