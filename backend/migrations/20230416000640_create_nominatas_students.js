/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('nominatas_students', (table) => {
    table.increments('nominata_student_id').primary()
    table.integer('nominata_id').unsigned().notNullable()
    table.integer('student_id').unsigned().notNullable()

    table.foreign('nominata_id').references('nominatas.nominata_id')
    table.foreign('student_id').references('students.student_id')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('nominatas_students')
}
