/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('favorites', (table) => {
    table.increments('favorite_id').primary()
    table.integer('rep_id').unsigned().notNullable()
    table.integer('student_id').unsigned().notNullable()

    table.foreign('rep_id').references('field_reps.rep_id')
    table.foreign('student_id').references('students.student_id')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('favorites')
}
